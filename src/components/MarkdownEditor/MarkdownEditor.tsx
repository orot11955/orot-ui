import {
  startTransition,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Link,
  Image,
  Minus,
  Table,
} from 'lucide-react';
import './MarkdownEditor.css';
import type {
  MarkdownEditorProps,
  CursorPos,
  SelectionRange,
} from './MarkdownEditor.types';
import {
  renderMarkdown,
  renderMarkdownLines,
  findImageRangeForDeletion,
  type MarkdownRenderOptions,
} from './parser';
import {
  saveCursor,
  saveSelection,
  restoreCursor,
  restoreSelection,
  getRawText,
} from './selection';
import {
  SlashMenu,
  filterSlashItems,
  type SlashMenuItem,
} from './SlashMenu';

export { renderMarkdown };

const URL_ONLY_RE = /^(https?:\/\/|www\.)[^\s<>()[\]{}'"]+$/i;
const SLASH_TRIGGER_RE = /(?:^|\s)(\/)(\S*)$/;

interface SlashState {
  anchor: CursorPos;
  query: string;
  rect: ViewportRect;
  activeIndex: number;
}

interface ImagePreviewState {
  src: string;
  alt: string;
}

interface ImageSize {
  width: number;
  height: number;
}

type EditorSelectionState = SelectionRange | CursorPos | null;
type HistoryEntryKind = 'typing' | 'command';

interface HistoryEntry {
  text: string;
  selection: EditorSelectionState;
}

interface HistoryState {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
  lastKind: HistoryEntryKind | 'none';
  lastAt: number;
}

interface ViewportRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const OVERLAY_VIEWPORT_GAP = 12;
const FLOATING_TOOLBAR_WIDTH = 156;
const FLOATING_TOOLBAR_HEIGHT = 42;
const FLOATING_TOOLBAR_GAP = 10;
const SLASH_MENU_WIDTH = 280;
const SLASH_MENU_MAX_HEIGHT = 320;
const SLASH_MENU_GAP = 8;
const HISTORY_LIMIT = 100;
const HISTORY_TYPING_MERGE_MS = 900;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function clampOverlayStart(
  start: number,
  size: number,
  viewportSize: number,
): number {
  return clamp(
    start,
    OVERLAY_VIEWPORT_GAP,
    viewportSize - size - OVERLAY_VIEWPORT_GAP,
  );
}

function toViewportRect(rect: DOMRect): ViewportRect {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

function getSelectionRect(): ViewportRect | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return toViewportRect(selection.getRangeAt(0).getBoundingClientRect());
}

function cloneSelectionState(
  selection: EditorSelectionState,
): EditorSelectionState {
  if (!selection) return null;
  if ('start' in selection) {
    return {
      start: { ...selection.start },
      end: { ...selection.end },
      collapsed: selection.collapsed,
    };
  }
  return { ...selection };
}

function createHistoryEntry(
  text: string,
  selection: EditorSelectionState,
): HistoryEntry {
  return {
    text,
    selection: cloneSelectionState(selection),
  };
}

function getFloatingToolbarPosition(rect: ViewportRect): {
  top: number;
  left: number;
} {
  const left = clampOverlayStart(
    rect.left + rect.width / 2 - FLOATING_TOOLBAR_WIDTH / 2,
    FLOATING_TOOLBAR_WIDTH,
    window.innerWidth,
  );
  const topAbove = rect.top - FLOATING_TOOLBAR_HEIGHT - FLOATING_TOOLBAR_GAP;
  const top =
    topAbove >= OVERLAY_VIEWPORT_GAP
      ? topAbove
      : clampOverlayStart(
          rect.bottom + FLOATING_TOOLBAR_GAP,
          FLOATING_TOOLBAR_HEIGHT,
          window.innerHeight,
        );

  return { top, left };
}

function getSlashMenuPosition(rect: ViewportRect): { top: number; left: number } {
  const left = clampOverlayStart(rect.left, SLASH_MENU_WIDTH, window.innerWidth);
  const menuHeight = Math.min(
    SLASH_MENU_MAX_HEIGHT,
    window.innerHeight - OVERLAY_VIEWPORT_GAP * 2,
  );
  const topBelow = rect.bottom + SLASH_MENU_GAP;
  const canOpenBelow = topBelow + menuHeight <= window.innerHeight - OVERLAY_VIEWPORT_GAP;
  const top = canOpenBelow
    ? topBelow
    : clampOverlayStart(
        rect.top - menuHeight - SLASH_MENU_GAP,
        menuHeight,
        window.innerHeight,
      );

  return { top, left };
}

function getRenderedMarkdownImageKey(root: ParentNode): string | null {
  const token = root
    .querySelector<HTMLElement>('.orot-md-image-token')
    ?.textContent?.trim();
  if (token) return token;

  const img = root.querySelector<HTMLImageElement>('.orot-md-image-preview__img');
  if (!img) return null;

  return `${img.getAttribute('alt') ?? ''}::${img.currentSrc || img.src}`;
}

function captureRenderedImages(root: ParentNode): Map<string, HTMLImageElement[]> {
  const preserved = new Map<string, HTMLImageElement[]>();

  root.querySelectorAll<HTMLElement>('.orot-md-image').forEach((imageRoot) => {
    const key = getRenderedMarkdownImageKey(imageRoot);
    const img = imageRoot.querySelector<HTMLImageElement>('.orot-md-image-preview__img');
    if (!key || !img) return;

    const bucket = preserved.get(key) ?? [];
    bucket.push(img);
    preserved.set(key, bucket);
  });

  return preserved;
}

function restoreRenderedImages(
  root: ParentNode,
  preserved: Map<string, HTMLImageElement[]>,
): void {
  if (preserved.size === 0) return;

  root.querySelectorAll<HTMLElement>('.orot-md-image').forEach((imageRoot) => {
    const key = getRenderedMarkdownImageKey(imageRoot);
    const nextImg = imageRoot.querySelector<HTMLImageElement>('.orot-md-image-preview__img');
    if (!key || !nextImg) return;

    const bucket = preserved.get(key);
    const savedImg = bucket?.shift();
    if (!savedImg) return;

    savedImg.className = nextImg.className;
    savedImg.alt = nextImg.alt;
    savedImg.draggable = false;
    const widthAttr = nextImg.getAttribute('width');
    const heightAttr = nextImg.getAttribute('height');
    if (widthAttr) {
      savedImg.setAttribute('width', widthAttr);
    } else {
      savedImg.removeAttribute('width');
    }
    if (heightAttr) {
      savedImg.setAttribute('height', heightAttr);
    } else {
      savedImg.removeAttribute('height');
    }
    nextImg.replaceWith(savedImg);

    if (bucket && bucket.length === 0) {
      preserved.delete(key);
    }
  });
}

function createRenderedFragment(
  doc: Document,
  renderedLines: string[],
): DocumentFragment {
  const template = doc.createElement('template');
  template.innerHTML = renderedLines.join('');
  return template.content;
}

function replaceAllRenderedLines(
  el: HTMLDivElement,
  renderedLines: string[],
): void {
  const preservedImages = captureRenderedImages(el);
  el.replaceChildren(createRenderedFragment(el.ownerDocument, renderedLines));
  restoreRenderedImages(el, preservedImages);
}

function patchRenderedLines(
  el: HTMLDivElement,
  prevLines: string[],
  nextLines: string[],
): boolean {
  if (prevLines.length === 0 || el.children.length !== prevLines.length) {
    return false;
  }

  let start = 0;
  while (
    start < prevLines.length &&
    start < nextLines.length &&
    prevLines[start] === nextLines[start]
  ) {
    start++;
  }

  let prevEnd = prevLines.length - 1;
  let nextEnd = nextLines.length - 1;
  while (
    prevEnd >= start &&
    nextEnd >= start &&
    prevLines[prevEnd] === nextLines[nextEnd]
  ) {
    prevEnd--;
    nextEnd--;
  }

  if (start > prevEnd && start > nextEnd) {
    return true;
  }

  const anchor = el.children.item(prevEnd + 1);

  for (let i = prevEnd; i >= start; i--) {
    el.children.item(i)?.remove();
  }

  if (start <= nextEnd) {
    el.insertBefore(
      createRenderedFragment(
        el.ownerDocument,
        nextLines.slice(start, nextEnd + 1),
      ),
      anchor,
    );
  }

  return true;
}

function getLineIndex(root: HTMLElement, lineEl: HTMLElement): number {
  return Array.prototype.indexOf.call(root.children, lineEl) as number;
}

function detectSlashTrigger(
  text: string,
  cursor: CursorPos,
): { anchor: CursorPos; query: string } | null {
  const lines = text.split('\n');
  const line = lines[cursor.lineIndex] ?? '';
  const before = line.slice(0, cursor.charOffset);
  const match = SLASH_TRIGGER_RE.exec(before);
  if (!match) return null;
  const query = match[2];
  return {
    anchor: {
      lineIndex: cursor.lineIndex,
      charOffset: before.length - 1 - query.length,
    },
    query,
  };
}

function createRenderCache(
  limit = 400,
): NonNullable<MarkdownRenderOptions['cache']> {
  const store = new Map<string, string[]>();

  return {
    get(key) {
      const cached = store.get(key);
      if (!cached) return undefined;
      store.delete(key);
      store.set(key, cached);
      return cached.slice();
    },
    set(key, lines) {
      if (store.has(key)) {
        store.delete(key);
      }
      store.set(key, lines.slice());
      if (store.size > limit) {
        const oldestKey = store.keys().next().value;
        if (oldestKey !== undefined) {
          store.delete(oldestKey);
        }
      }
    },
  };
}

function cursorToTextOffset(text: string, cursor: CursorPos): number {
  const lines = text.split('\n');
  const lineIndex = clamp(cursor.lineIndex, 0, Math.max(lines.length - 1, 0));
  let offset = 0;

  for (let i = 0; i < lineIndex; i++) {
    offset += (lines[i] ?? '').length + 1;
  }

  const line = lines[lineIndex] ?? '';
  return offset + clamp(cursor.charOffset, 0, line.length);
}

function textOffsetToCursor(text: string, offset: number): CursorPos {
  const safeOffset = clamp(offset, 0, text.length);
  const before = text.slice(0, safeOffset);
  const parts = before.split('\n');
  const last = parts[parts.length - 1] ?? '';

  return {
    lineIndex: parts.length - 1,
    charOffset: last.length,
  };
}

function replaceFirstOccurrence(
  text: string,
  search: string,
  replacement: string,
): { text: string; index: number } | null {
  const index = text.indexOf(search);
  if (index === -1) return null;

  return {
    text: text.slice(0, index) + replacement + text.slice(index + search.length),
    index,
  };
}

function adjustSelectionForReplacement(
  text: string,
  nextText: string,
  selection: EditorSelectionState,
  start: number,
  removedLength: number,
  insertedLength: number,
): EditorSelectionState {
  if (!selection) return null;

  const end = start + removedLength;
  const adjustOffset = (offset: number) => {
    if (offset <= start) return offset;
    if (offset >= end) return offset + insertedLength - removedLength;
    return start + insertedLength;
  };

  if ('start' in selection) {
    const startOffset = cursorToTextOffset(text, selection.start);
    const endOffset = cursorToTextOffset(text, selection.end);
    return {
      start: textOffsetToCursor(nextText, adjustOffset(startOffset)),
      end: textOffsetToCursor(nextText, adjustOffset(endOffset)),
      collapsed: selection.collapsed,
    };
  }

  const offset = cursorToTextOffset(text, selection);
  return textOffsetToCursor(nextText, adjustOffset(offset));
}

function createImageMarkdown(alt: string, url: string): string {
  return `![${alt}](${url})`;
}

function getDocumentEndCursor(text: string): CursorPos {
  const lines = text.split('\n');
  const lineIndex = Math.max(lines.length - 1, 0);
  return {
    lineIndex,
    charOffset: (lines[lineIndex] ?? '').length,
  };
}

function loadImageSize(src: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = 'async';
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        return;
      }
      reject(new Error(`Could not measure image: ${src}`));
    };
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

function safeRevokeObjectURL(url: string): void {
  if (!url.startsWith('blob:')) return;
  URL.revokeObjectURL(url);
}

export function MarkdownEditor({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  showToolbar = true,
  showFloatingToolbar = true,
  showSlashMenu = true,
  showWordCount = true,
  minHeight = 320,
  maxHeight,
  autoFocus = false,
  onImageUpload,
  resolveImageSource,
  onHashtagClick,
  className = '',
  style,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<string>(value ?? defaultValue);
  const renderedLinesRef = useRef<string[]>([]);
  const renderCacheRef = useRef<NonNullable<MarkdownRenderOptions['cache']>>(
    createRenderCache(),
  );
  const historyRef = useRef<HistoryState>({
    past: [],
    present: createHistoryEntry(value ?? defaultValue, null),
    future: [],
    lastKind: 'none',
    lastAt: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageSizeCacheRef = useRef<Map<string, ImageSize>>(new Map());
  const tempObjectUrlsRef = useRef<Set<string>>(new Set());
  const [stats, setStats] = useState<{ words: number; chars: number }>({
    words: 0,
    chars: 0,
  });
  const [isEmpty, setIsEmpty] = useState(!rawRef.current);
  const [isFocused, setIsFocused] = useState(false);
  const [floatingRect, setFloatingRect] = useState<ViewportRect | null>(null);
  const [slash, setSlash] = useState<SlashState | null>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreviewState | null>(null);
  const slashRef = useRef<SlashState | null>(null);
  const imagePreviewPointerRef = useRef(false);

  const updateSlash = useCallback((next: SlashState | null) => {
    slashRef.current = next;
    setSlash(next);
  }, []);

  const closeImagePreview = useCallback(() => {
    setImagePreview(null);
  }, []);

  // ── Helpers ─────────────────────────────────────────

  const cacheImageSize = useCallback((sources: Array<string | null | undefined>, size: ImageSize) => {
    const width = Math.round(size.width);
    const height = Math.round(size.height);
    if (width <= 0 || height <= 0) return;

    const cache = imageSizeCacheRef.current;
    sources.forEach((source) => {
      if (!source) return;
      const previous = cache.get(source);
      if (previous?.width === width && previous.height === height) return;
      cache.set(source, { width, height });
    });
  }, []);

  const getCachedImageSize = useCallback(
    (url: string, displaySrc: string, previewSrc: string) =>
      imageSizeCacheRef.current.get(url) ??
      imageSizeCacheRef.current.get(displaySrc) ??
      imageSizeCacheRef.current.get(previewSrc) ??
      null,
    [],
  );

  const resetHistory = useCallback(
    (text: string, selection: EditorSelectionState) => {
      historyRef.current = {
        past: [],
        present: createHistoryEntry(text, selection),
        future: [],
        lastKind: 'none',
        lastAt: 0,
      };
    },
    [],
  );

  const updateStats = useCallback(
    (text: string) => {
      const nextIsEmpty = !text;
      setIsEmpty((prev) => (prev === nextIsEmpty ? prev : nextIsEmpty));

      if (!showWordCount) return;

      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      startTransition(() => {
        setStats((prev) =>
          prev.words === words && prev.chars === chars ? prev : { words, chars },
        );
      });
    },
    [showWordCount],
  );

  const applyHTML = useCallback(
    (
      el: HTMLDivElement,
      text: string,
      sel: EditorSelectionState,
    ) => {
      const nextRenderedLines = renderMarkdownLines(text, {
        resolveImageSource,
        getImageSize: getCachedImageSize,
        cache: renderCacheRef.current,
      });
      const patched = patchRenderedLines(
        el,
        renderedLinesRef.current,
        nextRenderedLines,
      );

      if (!patched) {
        replaceAllRenderedLines(el, nextRenderedLines);
      }

      renderedLinesRef.current = nextRenderedLines;

      if (sel && 'start' in sel) {
        restoreSelection(el, sel as SelectionRange);
      } else {
        restoreCursor(el, sel as CursorPos | null);
      }
      updateStats(text);
    },
    [getCachedImageSize, resolveImageSource, updateStats],
  );

  const writeEditor = useCallback(
    (
      text: string,
      sel: EditorSelectionState,
      emitChange = true,
    ) => {
      const el = editorRef.current;
      if (!el) return;
      rawRef.current = text;
      applyHTML(el, text, sel);
      if (emitChange) {
        onChange?.(text);
      }
    },
    [applyHTML, onChange],
  );

  const replacePresent = useCallback(
    (
      text: string,
      selection: EditorSelectionState,
      emitChange = true,
    ) => {
      const history = historyRef.current;
      history.present = createHistoryEntry(text, selection);
      history.future = [];
      history.lastKind = 'none';
      history.lastAt = 0;
      writeEditor(text, selection, emitChange);
    },
    [writeEditor],
  );

  const recordHistoryChange = useCallback(
    (
      text: string,
      sel: EditorSelectionState,
      kind: HistoryEntryKind,
    ) => {
      const history = historyRef.current;
      const nextEntry = createHistoryEntry(text, sel);
      const now = Date.now();

      if (history.present.text === nextEntry.text) {
        history.present = nextEntry;
        history.lastKind = kind;
        history.lastAt = now;
        return;
      }

      const shouldMergeTyping =
        kind === 'typing' &&
        history.lastKind === 'typing' &&
        now - history.lastAt <= HISTORY_TYPING_MERGE_MS;

      if (shouldMergeTyping) {
        history.present = nextEntry;
      } else {
        history.past.push(createHistoryEntry(
          history.present.text,
          history.present.selection,
        ));
        if (history.past.length > HISTORY_LIMIT) {
          history.past.shift();
        }
        history.present = nextEntry;
      }

      history.future = [];
      history.lastKind = kind;
      history.lastAt = now;
    },
    [],
  );

  const commit = useCallback(
    (
      text: string,
      sel: EditorSelectionState,
      kind: HistoryEntryKind = 'command',
    ) => {
      recordHistoryChange(text, sel, kind);
      writeEditor(text, sel);
    },
    [recordHistoryChange, writeEditor],
  );

  const undo = useCallback(() => {
    const history = historyRef.current;
    const previous = history.past.pop();
    if (!previous) return;

    history.future.push(
      createHistoryEntry(history.present.text, history.present.selection),
    );
    history.present = createHistoryEntry(previous.text, previous.selection);
    history.lastKind = 'none';
    history.lastAt = 0;

    if (slashRef.current) updateSlash(null);
    setFloatingRect(null);
    writeEditor(previous.text, previous.selection);
  }, [updateSlash, writeEditor]);

  const redo = useCallback(() => {
    const history = historyRef.current;
    const next = history.future.pop();
    if (!next) return;

    history.past.push(
      createHistoryEntry(history.present.text, history.present.selection),
    );
    if (history.past.length > HISTORY_LIMIT) {
      history.past.shift();
    }
    history.present = createHistoryEntry(next.text, next.selection);
    history.lastKind = 'none';
    history.lastAt = 0;

    if (slashRef.current) updateSlash(null);
    setFloatingRect(null);
    writeEditor(next.text, next.selection);
  }, [updateSlash, writeEditor]);

  useEffect(() => {
    if (!showWordCount) return;
    updateStats(rawRef.current);
  }, [showWordCount, updateStats]);

  useEffect(() => {
    if (!imagePreview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImagePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeImagePreview, imagePreview]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleImageLoad = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains('orot-md-image-preview__img')) return;
      if (target.naturalWidth <= 0 || target.naturalHeight <= 0) return;

      const imageRoot = target.closest<HTMLElement>('.orot-md-image');
      cacheImageSize(
        [
          imageRoot?.dataset.imageSrc,
          imageRoot?.dataset.imagePreviewSrc,
          target.currentSrc || target.getAttribute('src'),
        ],
        {
          width: target.naturalWidth,
          height: target.naturalHeight,
        },
      );
    };

    el.addEventListener('load', handleImageLoad, true);
    return () => el.removeEventListener('load', handleImageLoad, true);
  }, [cacheImageSize]);

  useEffect(
    () => () => {
      tempObjectUrlsRef.current.forEach((url) => safeRevokeObjectURL(url));
      tempObjectUrlsRef.current.clear();
    },
    [],
  );

  // ── Initialize ───────────────────────────────────────

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    applyHTML(el, rawRef.current, null);
    resetHistory(rawRef.current, null);
    if (autoFocus) el.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controlled sync ──────────────────────────────────

  useEffect(() => {
    if (value === undefined) return;
    if (value === rawRef.current) return;
    rawRef.current = value;
    const el = editorRef.current;
    if (!el) return;
    applyHTML(el, value, null);
    resetHistory(value, null);
  }, [value, applyHTML, resetHistory]);

  // ── Input handler ────────────────────────────────────

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const cursor = saveCursor(el);
    const text = getRawText(el);
    const trigger =
      showSlashMenu && !readOnly && cursor
        ? detectSlashTrigger(text, cursor)
        : null;
    const selectionRect = trigger ? getSelectionRect() : null;
    commit(text, cursor, 'typing');

    if (!showSlashMenu || readOnly) return;
    if (!cursor) return;
    if (!trigger) {
      if (slashRef.current) updateSlash(null);
      return;
    }
    if (slashRef.current) {
      updateSlash({
        ...slashRef.current,
        anchor: trigger.anchor,
        query: trigger.query,
        rect: selectionRect ?? slashRef.current.rect,
        activeIndex:
          slashRef.current.anchor.lineIndex !== trigger.anchor.lineIndex ||
          slashRef.current.anchor.charOffset !== trigger.anchor.charOffset ||
          slashRef.current.query !== trigger.query
            ? 0
            : slashRef.current.activeIndex,
      });
      return;
    }
    if (!selectionRect) return;
    updateSlash({
      anchor: trigger.anchor,
      query: trigger.query,
      rect: selectionRect,
      activeIndex: 0,
    });
  }, [commit, showSlashMenu, readOnly, updateSlash]);

  // ── Format helpers ───────────────────────────────────

  const applyInlineWrap = useCallback(
    (openMark: string, closeMark: string) => {
      const el = editorRef.current;
      if (!el) return;
      const sel = saveSelection(el);
      if (!sel) return;

      const lines = rawRef.current.split('\n');

      // Collapsed cursor: insert markers and place cursor between them
      if (sel.collapsed) {
        const line = lines[sel.start.lineIndex] ?? '';
        const newLine =
          line.slice(0, sel.start.charOffset) +
          openMark +
          closeMark +
          line.slice(sel.start.charOffset);
        lines[sel.start.lineIndex] = newLine;
        const next: CursorPos = {
          lineIndex: sel.start.lineIndex,
          charOffset: sel.start.charOffset + openMark.length,
        };
        commit(lines.join('\n'), next);
        el.focus();
        return;
      }

      // Non-collapsed: wrap/toggle. Only support single-line selections.
      if (sel.start.lineIndex !== sel.end.lineIndex) {
        // Multi-line: fall back to inserting markers around the full span
        // by wrapping each line's selected portion individually.
        const out = lines.slice();
        for (let li = sel.start.lineIndex; li <= sel.end.lineIndex; li++) {
          const line = out[li] ?? '';
          const s = li === sel.start.lineIndex ? sel.start.charOffset : 0;
          const e = li === sel.end.lineIndex ? sel.end.charOffset : line.length;
          out[li] =
            line.slice(0, s) + openMark + line.slice(s, e) + closeMark + line.slice(e);
        }
        commit(out.join('\n'), {
          start: {
            lineIndex: sel.start.lineIndex,
            charOffset: sel.start.charOffset + openMark.length,
          },
          end: {
            lineIndex: sel.end.lineIndex,
            charOffset:
              sel.end.lineIndex === sel.start.lineIndex
                ? sel.end.charOffset + openMark.length
                : sel.end.charOffset + openMark.length,
          },
          collapsed: false,
        });
        el.focus();
        return;
      }

      const lineIdx = sel.start.lineIndex;
      const line = lines[lineIdx] ?? '';
      const selected = line.slice(sel.start.charOffset, sel.end.charOffset);

      // Toggle form 1: selection already wraps with marks
      if (
        selected.startsWith(openMark) &&
        selected.endsWith(closeMark) &&
        selected.length >= openMark.length + closeMark.length
      ) {
        const inner = selected.slice(
          openMark.length,
          selected.length - closeMark.length,
        );
        const newLine =
          line.slice(0, sel.start.charOffset) + inner + line.slice(sel.end.charOffset);
        lines[lineIdx] = newLine;
        commit(lines.join('\n'), {
          start: { lineIndex: lineIdx, charOffset: sel.start.charOffset },
          end: {
            lineIndex: lineIdx,
            charOffset: sel.start.charOffset + inner.length,
          },
          collapsed: inner.length === 0,
        });
        el.focus();
        return;
      }

      // Toggle form 2: marks sit just outside selection
      const beforeIsOpen =
        line.slice(sel.start.charOffset - openMark.length, sel.start.charOffset) ===
        openMark;
      const afterIsClose =
        line.slice(sel.end.charOffset, sel.end.charOffset + closeMark.length) ===
        closeMark;
      if (beforeIsOpen && afterIsClose) {
        const newLine =
          line.slice(0, sel.start.charOffset - openMark.length) +
          line.slice(sel.start.charOffset, sel.end.charOffset) +
          line.slice(sel.end.charOffset + closeMark.length);
        lines[lineIdx] = newLine;
        commit(lines.join('\n'), {
          start: {
            lineIndex: lineIdx,
            charOffset: sel.start.charOffset - openMark.length,
          },
          end: {
            lineIndex: lineIdx,
            charOffset: sel.end.charOffset - openMark.length,
          },
          collapsed: false,
        });
        el.focus();
        return;
      }

      // Plain wrap
      const newLine =
        line.slice(0, sel.start.charOffset) +
        openMark +
        selected +
        closeMark +
        line.slice(sel.end.charOffset);
      lines[lineIdx] = newLine;
      commit(lines.join('\n'), {
        start: {
          lineIndex: lineIdx,
          charOffset: sel.start.charOffset + openMark.length,
        },
        end: {
          lineIndex: lineIdx,
          charOffset: sel.end.charOffset + openMark.length,
        },
        collapsed: false,
      });
      el.focus();
    },
    [commit],
  );

  const toggleBlockPrefix = useCallback(
    (prefix: string) => {
      const el = editorRef.current;
      if (!el) return;
      const sel = saveSelection(el);
      if (!sel) return;

      const lines = rawRef.current.split('\n');
      const startIdx = sel.start.lineIndex;
      const endIdx = sel.end.lineIndex;

      // Detect uniform prefix: toggle off if *all* selected lines share it
      const allHave = lines
        .slice(startIdx, endIdx + 1)
        .every((l) => l.startsWith(prefix));

      // When toggling off, also drop sibling heading / list markers on the same line.
      const HEADING_RE = /^#{1,6} /;
      const LIST_RE = /^(\s*)(?:[-*+]|\d+\.) /;
      const TASK_RE = /^(\s*)-\s\[[ xX]\] /;

      for (let li = startIdx; li <= endIdx; li++) {
        const line = lines[li] ?? '';
        if (allHave) {
          lines[li] = line.slice(prefix.length);
        } else {
          let base = line;
          // Strip competing prefixes so toggling feels natural
          if (prefix.match(HEADING_RE) || prefix === '> ') {
            base = base.replace(HEADING_RE, '');
            base = base.replace(/^> /, '');
          }
          if (prefix.match(LIST_RE) || prefix.match(TASK_RE)) {
            base = base.replace(TASK_RE, '$1');
            base = base.replace(LIST_RE, '$1');
          }
          lines[li] = prefix + base;
        }
      }

      const delta = allHave ? -prefix.length : prefix.length;
      commit(lines.join('\n'), {
        start: {
          lineIndex: startIdx,
          charOffset: Math.max(0, sel.start.charOffset + delta),
        },
        end: {
          lineIndex: endIdx,
          charOffset: Math.max(0, sel.end.charOffset + delta),
        },
        collapsed: sel.collapsed,
      });
      el.focus();
    },
    [commit],
  );

  const insertAtCursor = useCallback(
    (text: string, selectInserted = false) => {
      const el = editorRef.current;
      if (!el) return;
      const sel =
        saveSelection(el) ?? {
          start: getDocumentEndCursor(rawRef.current),
          end: getDocumentEndCursor(rawRef.current),
          collapsed: true,
        };
      const lines = rawRef.current.split('\n');
      const lineIdx = sel.start.lineIndex;
      const line = lines[lineIdx] ?? '';
      const pasted = text.split('\n');

      const beforeCursor = line.slice(0, sel.start.charOffset);
      const afterCursor = line.slice(sel.end.charOffset);

      const replacement =
        pasted.length === 1
          ? [beforeCursor + pasted[0] + afterCursor]
          : [
              beforeCursor + pasted[0],
              ...pasted.slice(1, -1),
              pasted[pasted.length - 1] + afterCursor,
            ];

      lines.splice(lineIdx, sel.end.lineIndex - lineIdx + 1, ...replacement);

      const lastLineIdx = lineIdx + pasted.length - 1;
      const lastLineLen =
        pasted.length === 1 ? beforeCursor.length + pasted[0].length : pasted[pasted.length - 1].length;

      const next: SelectionRange = selectInserted
        ? {
            start: { lineIndex: lineIdx, charOffset: beforeCursor.length },
            end: { lineIndex: lastLineIdx, charOffset: lastLineLen },
            collapsed: false,
          }
        : {
            start: { lineIndex: lastLineIdx, charOffset: lastLineLen },
            end: { lineIndex: lastLineIdx, charOffset: lastLineLen },
            collapsed: true,
          };

      commit(lines.join('\n'), next);
    },
    [commit],
  );

  const insertTable = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const template = [
      '',
      '| Column 1 | Column 2 | Column 3 |',
      '| -------- | -------- | -------- |',
      '| Cell     | Cell     | Cell     |',
      '',
    ].join('\n');
    insertAtCursor(template);
    el.focus();
  }, [insertAtCursor]);

  // ── Slash commands ───────────────────────────────────

  const slashCommands = useMemo<SlashMenuItem[]>(
    () => [
      {
        id: 'h1',
        icon: <Heading1 size={16} />,
        label: 'Heading 1',
        description: 'Large section title',
        keywords: ['h1', 'heading', 'title', '제목', '헤딩'],
      },
      {
        id: 'h2',
        icon: <Heading2 size={16} />,
        label: 'Heading 2',
        description: 'Medium section title',
        keywords: ['h2', 'heading', 'title', '제목', '헤딩'],
      },
      {
        id: 'h3',
        icon: <Heading3 size={16} />,
        label: 'Heading 3',
        description: 'Small section title',
        keywords: ['h3', 'heading', 'title', '제목', '헤딩'],
      },
      {
        id: 'ul',
        icon: <List size={16} />,
        label: 'Bullet list',
        description: 'Unordered list',
        keywords: ['list', 'bullet', 'ul', '목록', '리스트'],
      },
      {
        id: 'ol',
        icon: <ListOrdered size={16} />,
        label: 'Numbered list',
        description: 'Ordered list',
        keywords: ['list', 'ordered', 'ol', 'number', '순서', '번호'],
      },
      {
        id: 'task',
        icon: <CheckSquare size={16} />,
        label: 'Task list',
        description: 'Checkbox to-do list',
        keywords: ['task', 'todo', 'checkbox', '작업', '체크', '할일'],
      },
      {
        id: 'quote',
        icon: <Quote size={16} />,
        label: 'Quote',
        description: 'Blockquote',
        keywords: ['quote', 'blockquote', '인용', '인용문'],
      },
      {
        id: 'code',
        icon: <Code size={16} />,
        label: 'Code block',
        description: 'Fenced code block',
        keywords: ['code', 'codeblock', 'pre', 'fence', '코드'],
      },
      {
        id: 'hr',
        icon: <Minus size={16} />,
        label: 'Divider',
        description: 'Horizontal rule',
        keywords: ['hr', 'divider', 'rule', 'separator', '구분선'],
      },
      {
        id: 'table',
        icon: <Table size={16} />,
        label: 'Table',
        description: 'Insert a 3×3 table',
        keywords: ['table', 'grid', '표', '테이블'],
      },
      {
        id: 'link',
        icon: <Link size={16} />,
        label: 'Link',
        description: 'Insert a hyperlink',
        keywords: ['link', 'url', 'hyperlink', 'anchor', '링크'],
      },
      {
        id: 'image',
        icon: <Image size={16} />,
        label: 'Image',
        description: 'Upload or embed an image',
        keywords: ['image', 'img', 'photo', 'picture', '이미지', '사진'],
      },
    ],
    [],
  );

  const executeSlashCommand = useCallback(
    (id: string) => {
      const el = editorRef.current;
      const state = slashRef.current;
      if (!el || !state) return;

      const { anchor, query } = state;
      const lines = rawRef.current.split('\n');
      const line = lines[anchor.lineIndex] ?? '';
      const before = line.slice(0, anchor.charOffset);
      const after = line.slice(anchor.charOffset + 1 + query.length);
      const cleanedLine = before + after;

      updateSlash(null);

      const applyBlockPrefix = (prefix: string) => {
        lines[anchor.lineIndex] = prefix + cleanedLine;
        commit(lines.join('\n'), {
          lineIndex: anchor.lineIndex,
          charOffset: prefix.length + before.length,
        });
      };

      const insertBlockTemplate = (
        template: string[],
        cursorLine: number,
        cursorChar: number,
      ) => {
        if (cleanedLine.trim() === '') {
          lines.splice(anchor.lineIndex, 1, ...template);
          commit(lines.join('\n'), {
            lineIndex: anchor.lineIndex + cursorLine,
            charOffset: cursorChar,
          });
        } else {
          lines[anchor.lineIndex] = cleanedLine;
          lines.splice(anchor.lineIndex + 1, 0, ...template);
          commit(lines.join('\n'), {
            lineIndex: anchor.lineIndex + 1 + cursorLine,
            charOffset: cursorChar,
          });
        }
      };

      switch (id) {
        case 'h1':
          applyBlockPrefix('# ');
          break;
        case 'h2':
          applyBlockPrefix('## ');
          break;
        case 'h3':
          applyBlockPrefix('### ');
          break;
        case 'ul':
          applyBlockPrefix('- ');
          break;
        case 'ol':
          applyBlockPrefix('1. ');
          break;
        case 'task':
          applyBlockPrefix('- [ ] ');
          break;
        case 'quote':
          applyBlockPrefix('> ');
          break;
        case 'hr':
          insertBlockTemplate(['---', ''], 1, 0);
          break;
        case 'code':
          insertBlockTemplate(['```', '', '```'], 1, 0);
          break;
        case 'table':
          insertBlockTemplate(
            [
              '| Column 1 | Column 2 | Column 3 |',
              '| -------- | -------- | -------- |',
              '| Cell     | Cell     | Cell     |',
            ],
            0,
            2,
          );
          break;
        case 'link': {
          const inserted = '[](url)';
          lines[anchor.lineIndex] = before + inserted + after;
          commit(lines.join('\n'), {
            lineIndex: anchor.lineIndex,
            charOffset: before.length + 1,
          });
          break;
        }
        case 'image': {
          lines[anchor.lineIndex] = cleanedLine;
          commit(lines.join('\n'), {
            lineIndex: anchor.lineIndex,
            charOffset: before.length,
          });
          requestAnimationFrame(() => fileInputRef.current?.click());
          break;
        }
      }
      el.focus();
    },
    [commit, updateSlash],
  );

  // ── Keyboard handler ─────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = editorRef.current;
      if (!el) return;

      // ── Slash menu navigation ────────────────────
      if (slashRef.current) {
        const filtered = filterSlashItems(slashCommands, slashRef.current.query);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const len = Math.max(1, filtered.length);
          updateSlash({
            ...slashRef.current,
            activeIndex: (slashRef.current.activeIndex + 1) % len,
          });
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const len = Math.max(1, filtered.length);
          updateSlash({
            ...slashRef.current,
            activeIndex: (slashRef.current.activeIndex - 1 + len) % len,
          });
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          if (filtered.length > 0) {
            e.preventDefault();
            const cmd = filtered[slashRef.current.activeIndex] ?? filtered[0];
            executeSlashCommand(cmd.id);
            return;
          }
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          updateSlash(null);
          return;
        }
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        const cursor = saveCursor(el);
        if (cursor) {
          const lines = rawRef.current.split('\n');
          const line = lines[cursor.lineIndex] ?? '';
          const imageRange = findImageRangeForDeletion(
            line,
            cursor.charOffset,
            e.key === 'Backspace' ? 'backward' : 'forward',
          );

          if (imageRange) {
            e.preventDefault();
            lines[cursor.lineIndex] =
              line.slice(0, imageRange.start) + line.slice(imageRange.end);
            commit(lines.join('\n'), {
              lineIndex: cursor.lineIndex,
              charOffset: imageRange.start,
            });
            return;
          }
        }
      }

      // ── Enter ──────────────────────────────────────
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const cursor = saveCursor(el);
        if (!cursor) return;

        const lines = rawRef.current.split('\n');
        const line = lines[cursor.lineIndex] ?? '';
        const before = line.slice(0, cursor.charOffset);
        const after = line.slice(cursor.charOffset);

        let newPrefix = '';
        let exitingList = false;
        const taskMatch = line.match(/^(\s*)-\s\[[ xX]\] /);
        const ulMatch = line.match(/^(\s*)[-*+] /);
        const olMatch = line.match(/^(\s*)(\d+)\. /);

        if (taskMatch) {
          if (line.trim() === taskMatch[0].trim()) {
            exitingList = true;
          } else {
            newPrefix = `${taskMatch[1]}- [ ] `;
          }
        } else if (ulMatch) {
          if (line.trim() === ulMatch[0].trim()) {
            exitingList = true;
          } else {
            newPrefix = `${ulMatch[1]}- `;
          }
        } else if (olMatch) {
          if (line.trim() === olMatch[0].trim()) {
            exitingList = true;
          } else {
            newPrefix = `${olMatch[1]}${parseInt(olMatch[2]) + 1}. `;
          }
        }

        if (exitingList) {
          // Drop the empty list marker; keep cursor on the now-blank line.
          lines[cursor.lineIndex] = '';
          commit(lines.join('\n'), {
            lineIndex: cursor.lineIndex,
            charOffset: 0,
          });
        } else {
          lines[cursor.lineIndex] = before;
          lines.splice(cursor.lineIndex + 1, 0, newPrefix + after);
          commit(lines.join('\n'), {
            lineIndex: cursor.lineIndex + 1,
            charOffset: newPrefix.length,
          });
        }
        return;
      }

      // ── Shift+Enter: soft line break (no list continuation) ──
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        const cursor = saveCursor(el);
        if (!cursor) return;
        const lines = rawRef.current.split('\n');
        const line = lines[cursor.lineIndex] ?? '';
        lines[cursor.lineIndex] = line.slice(0, cursor.charOffset);
        lines.splice(cursor.lineIndex + 1, 0, line.slice(cursor.charOffset));
        commit(lines.join('\n'), {
          lineIndex: cursor.lineIndex + 1,
          charOffset: 0,
        });
        return;
      }

      // ── Tab / Shift+Tab ───────────────────────────
      if (e.key === 'Tab') {
        e.preventDefault();
        const sel = saveSelection(el);
        if (!sel) return;
        const lines = rawRef.current.split('\n');
        const startIdx = sel.start.lineIndex;
        const endIdx = sel.end.lineIndex;

        if (e.shiftKey) {
          let startDelta = 0;
          let endDelta = 0;
          for (let li = startIdx; li <= endIdx; li++) {
            const line = lines[li] ?? '';
            if (line.startsWith('  ')) {
              lines[li] = line.slice(2);
              if (li === startIdx) startDelta = -2;
              if (li === endIdx) endDelta = -2;
            }
          }
          commit(lines.join('\n'), {
            start: {
              lineIndex: startIdx,
              charOffset: Math.max(0, sel.start.charOffset + startDelta),
            },
            end: {
              lineIndex: endIdx,
              charOffset: Math.max(0, sel.end.charOffset + endDelta),
            },
            collapsed: sel.collapsed,
          });
        } else {
          for (let li = startIdx; li <= endIdx; li++) {
            lines[li] = '  ' + (lines[li] ?? '');
          }
          commit(lines.join('\n'), {
            start: {
              lineIndex: startIdx,
              charOffset: sel.start.charOffset + 2,
            },
            end: {
              lineIndex: endIdx,
              charOffset: sel.end.charOffset + 2,
            },
            collapsed: sel.collapsed,
          });
        }
        return;
      }

      // ── Cmd/Ctrl shortcuts ────────────────────────
      const mod = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;
      if (!mod) return;

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (shift) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if (!shift && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        applyInlineWrap('**', '**');
        return;
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        applyInlineWrap('*', '*');
        return;
      }
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        applyInlineWrap('[', '](url)');
        return;
      }
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        applyInlineWrap('`', '`');
        return;
      }
      if (shift && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault();
        applyInlineWrap('~~', '~~');
        return;
      }
      if (shift && (e.key === 'H' || e.key === 'h')) {
        e.preventDefault();
        applyInlineWrap('==', '==');
        return;
      }
      if (e.key === '1' && !shift) {
        e.preventDefault();
        toggleBlockPrefix('# ');
        return;
      }
      if (e.key === '2' && !shift) {
        e.preventDefault();
        toggleBlockPrefix('## ');
        return;
      }
      if (e.key === '3' && !shift) {
        e.preventDefault();
        toggleBlockPrefix('### ');
        return;
      }
      if (shift && e.key === '8') {
        e.preventDefault();
        toggleBlockPrefix('- ');
        return;
      }
      if (shift && e.key === '7') {
        e.preventDefault();
        toggleBlockPrefix('1. ');
        return;
      }
      if (shift && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        toggleBlockPrefix('- [ ] ');
        return;
      }
      if (shift && (e.key === '.' || e.key === '>')) {
        e.preventDefault();
        toggleBlockPrefix('> ');
        return;
      }
    },
    [applyInlineWrap, redo, toggleBlockPrefix, undo],
  );

  // ── Paste handler ────────────────────────────────────

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const el = editorRef.current;
      if (!el) return;

      const pastedText = e.clipboardData.getData('text/plain');
      if (!pastedText) return;

      const sel = saveSelection(el);
      if (!sel) return;

      // Smart URL paste: URL over non-empty selection → markdown link
      if (!sel.collapsed && URL_ONLY_RE.test(pastedText.trim())) {
        const url = pastedText.trim();
        if (sel.start.lineIndex === sel.end.lineIndex) {
          const lines = rawRef.current.split('\n');
          const line = lines[sel.start.lineIndex] ?? '';
          const selected = line.slice(sel.start.charOffset, sel.end.charOffset);
          const inserted = `[${selected}](${url})`;
          lines[sel.start.lineIndex] =
            line.slice(0, sel.start.charOffset) +
            inserted +
            line.slice(sel.end.charOffset);
          commit(lines.join('\n'), {
            lineIndex: sel.start.lineIndex,
            charOffset: sel.start.charOffset + inserted.length,
          });
          return;
        }
      }

      // Default: plain-text paste replacing selection
      const allLines = rawRef.current.split('\n');
      const startLine = allLines[sel.start.lineIndex] ?? '';
      const endLine = allLines[sel.end.lineIndex] ?? '';
      const beforeCursor = startLine.slice(0, sel.start.charOffset);
      const afterCursor = endLine.slice(sel.end.charOffset);
      const pastedLines = pastedText.split('\n');

      const replacementLines =
        pastedLines.length === 1
          ? [beforeCursor + pastedLines[0] + afterCursor]
          : [
              beforeCursor + pastedLines[0],
              ...pastedLines.slice(1, -1),
              pastedLines[pastedLines.length - 1] + afterCursor,
            ];

      allLines.splice(
        sel.start.lineIndex,
        sel.end.lineIndex - sel.start.lineIndex + 1,
        ...replacementLines,
      );

      const newLineIndex = sel.start.lineIndex + pastedLines.length - 1;
      const newCharOffset =
        pastedLines.length === 1
          ? beforeCursor.length + pastedLines[0].length
          : pastedLines[pastedLines.length - 1].length;

      commit(allLines.join('\n'), {
        lineIndex: newLineIndex,
        charOffset: newCharOffset,
      });
    },
    [commit],
  );

  const handleContentMouseDownCapture = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      imagePreviewPointerRef.current =
        Boolean(target.closest('.orot-md-image-preview__img')) &&
        (readOnly || !isFocused);
    },
    [isFocused, readOnly],
  );

  // ── Click handler (task checkboxes + hashtags) ───────

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const imageThumb = target.closest<HTMLImageElement>('.orot-md-image-preview__img');

      if (imageThumb) {
        const shouldOpenPreview = imagePreviewPointerRef.current;
        imagePreviewPointerRef.current = false;

        if (shouldOpenPreview) {
          const imageRoot = imageThumb.closest<HTMLElement>('.orot-md-image');
          const previewSrc =
            imageRoot?.dataset.imagePreviewSrc || imageRoot?.dataset.imageSrc;
          if (previewSrc) {
            e.preventDefault();
            setImagePreview({
              src: previewSrc,
              alt: imageRoot?.dataset.imageAlt ?? imageThumb.alt ?? '',
            });
            return;
          }
        }
      }

      // Task checkbox toggle
      const toggle = target.closest<HTMLElement>('.orot-md-task-toggle');
      if (toggle) {
        const el = editorRef.current;
        if (!el || readOnly) return;
        e.preventDefault();
        const lineEl = toggle.closest<HTMLElement>('.orot-md-line');
        if (!lineEl) return;
        const lineIdx = getLineIndex(el, lineEl);
        if (lineIdx < 0) return;
        const lines = rawRef.current.split('\n');
        const line = lines[lineIdx] ?? '';
        const m = line.match(/^(\s*-\s\[)([ xX])(\] .*)$/);
        if (!m) return;
        const isChecked = m[2].toLowerCase() === 'x';
        lines[lineIdx] = m[1] + (isChecked ? ' ' : 'x') + m[3];
        const cursor = saveCursor(el);
        commit(lines.join('\n'), cursor);
        return;
      }

      // Hashtag click
      const hashtag = target.closest<HTMLElement>('.orot-md-hashtag');
      if (hashtag && onHashtagClick) {
        const tag = hashtag.dataset.tag;
        if (tag) onHashtagClick(tag);
      }
    },
    [commit, onHashtagClick, readOnly],
  );

  // ── Drag-and-drop images ─────────────────────────────

  const captureEditorSelectionState = useCallback((): EditorSelectionState => {
    const el = editorRef.current;
    if (!el) return null;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) {
      return null;
    }

    return selection.isCollapsed ? saveCursor(el) : saveSelection(el);
  }, []);

  const replaceImageUrl = useCallback(
    (tempUrl: string, nextUrl: string) => {
      const currentText = rawRef.current;
      const replacement = replaceFirstOccurrence(currentText, tempUrl, nextUrl);
      tempObjectUrlsRef.current.delete(tempUrl);

      if (!replacement) {
        safeRevokeObjectURL(tempUrl);
        return false;
      }

      const selection = captureEditorSelectionState();
      const nextSelection = adjustSelectionForReplacement(
        currentText,
        replacement.text,
        selection,
        replacement.index,
        tempUrl.length,
        nextUrl.length,
      );

      replacePresent(replacement.text, nextSelection, true);
      safeRevokeObjectURL(tempUrl);
      return true;
    },
    [captureEditorSelectionState, replacePresent],
  );

  const insertImages = useCallback(
    (files: File[]) => {
      const el = editorRef.current;
      if (!el) return;

      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      const uploads = imageFiles.map((file) => {
        const tempUrl = URL.createObjectURL(file);
        tempObjectUrlsRef.current.add(tempUrl);
        void loadImageSize(tempUrl)
          .then((size) => cacheImageSize([tempUrl], size))
          .catch(() => {});

        return {
          file,
          tempUrl,
          insertion: createImageMarkdown(file.name, tempUrl),
        };
      });

      insertAtCursor(uploads.map((item) => item.insertion).join(''));
      el.focus();

      uploads.forEach(({ file, tempUrl }) => {
        void (async () => {
          try {
            const finalUrl = onImageUpload
              ? await onImageUpload(file)
              : await fileToDataURL(file);
            const cachedSize = imageSizeCacheRef.current.get(tempUrl);
            if (cachedSize) {
              cacheImageSize([finalUrl], cachedSize);
            }
            replaceImageUrl(tempUrl, finalUrl);
          } catch (error) {
            console.error('MarkdownEditor image upload failed.', error);
          }
        })();
      });
    },
    [cacheImageSize, insertAtCursor, onImageUpload, replaceImageUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (!files.length) return;
      e.preventDefault();
      insertImages(files);
    },
    [insertImages],
  );

  const handleDragOver = (e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.items).some((i) => i.type.startsWith('image/'))) {
      e.preventDefault();
    }
  };

  const handleImageToolbar = () => fileInputRef.current?.click();

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []).filter((file) =>
        file.type.startsWith('image/'),
      );
      e.target.value = '';
      if (!files.length) return;
      insertImages(files);
    },
    [insertImages],
  );

  // ── Floating selection toolbar ───────────────────────

  useEffect(() => {
    if (!showFloatingToolbar || readOnly) return;
    const el = editorRef.current;
    if (!el) return;

    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setFloatingRect(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) {
        setFloatingRect(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width < 2 && rect.height < 2) {
        setFloatingRect(null);
        return;
      }
      setFloatingRect(toViewportRect(rect));
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [showFloatingToolbar, readOnly]);

  useEffect(() => {
    if (!showFloatingToolbar || readOnly || !floatingRect) return;
    const el = editorRef.current;
    if (!el) return;

    const syncFloatingRect = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setFloatingRect(null);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!el.contains(range.startContainer) || !el.contains(range.endContainer)) {
        setFloatingRect(null);
        return;
      }
      setFloatingRect(toViewportRect(range.getBoundingClientRect()));
    };

    window.addEventListener('scroll', syncFloatingRect, true);
    window.addEventListener('resize', syncFloatingRect);
    return () => {
      window.removeEventListener('scroll', syncFloatingRect, true);
      window.removeEventListener('resize', syncFloatingRect);
    };
  }, [showFloatingToolbar, readOnly, floatingRect]);

  // ── Slash menu: close / sync on cursor movement ──────

  useEffect(() => {
    if (!showSlashMenu || readOnly) return;
    const el = editorRef.current;
    if (!el) return;

    const onSelectionChange = () => {
      if (!slashRef.current) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!el.contains(range.startContainer)) return;
      const caret = saveCursor(el);
      if (!caret) return;
      const trigger = detectSlashTrigger(rawRef.current, caret);
      if (
        !trigger ||
        trigger.anchor.lineIndex !== slashRef.current.anchor.lineIndex ||
        trigger.anchor.charOffset !== slashRef.current.anchor.charOffset
      ) {
        updateSlash(null);
      } else {
        updateSlash({
          ...slashRef.current,
          query: trigger.query,
          rect: getSelectionRect() ?? slashRef.current.rect,
          activeIndex:
            trigger.query !== slashRef.current.query
              ? 0
              : slashRef.current.activeIndex,
        });
      }
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [showSlashMenu, readOnly, updateSlash]);

  useEffect(() => {
    if (!showSlashMenu || readOnly || !slash) return;
    const el = editorRef.current;
    if (!el) return;

    const syncSlashRect = () => {
      if (!slashRef.current) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!el.contains(range.startContainer)) return;

      updateSlash({
        ...slashRef.current,
        rect: toViewportRect(range.getBoundingClientRect()),
      });
    };

    window.addEventListener('scroll', syncSlashRect, true);
    window.addEventListener('resize', syncSlashRect);
    return () => {
      window.removeEventListener('scroll', syncSlashRect, true);
      window.removeEventListener('resize', syncSlashRect);
    };
  }, [showSlashMenu, readOnly, slash, updateSlash]);

  // ── CSS size values ──────────────────────────────────

  const toCSS = (v: number | string | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

  // ── Toolbar config ───────────────────────────────────

  const toolbarGroups = [
    [
      { icon: <Heading1 size={15} />, label: 'Heading 1 (⌘1)', action: () => toggleBlockPrefix('# ') },
      { icon: <Heading2 size={15} />, label: 'Heading 2 (⌘2)', action: () => toggleBlockPrefix('## ') },
      { icon: <Heading3 size={15} />, label: 'Heading 3 (⌘3)', action: () => toggleBlockPrefix('### ') },
    ],
    [
      { icon: <Bold size={15} />, label: 'Bold (⌘B)', action: () => applyInlineWrap('**', '**') },
      { icon: <Italic size={15} />, label: 'Italic (⌘I)', action: () => applyInlineWrap('*', '*') },
      { icon: <Strikethrough size={15} />, label: 'Strikethrough (⌘⇧X)', action: () => applyInlineWrap('~~', '~~') },
      { icon: <Code size={15} />, label: 'Inline code (⌘E)', action: () => applyInlineWrap('`', '`') },
    ],
    [
      { icon: <List size={15} />, label: 'Unordered list (⌘⇧8)', action: () => toggleBlockPrefix('- ') },
      { icon: <ListOrdered size={15} />, label: 'Ordered list (⌘⇧7)', action: () => toggleBlockPrefix('1. ') },
      { icon: <CheckSquare size={15} />, label: 'Task list (⌘⇧U)', action: () => toggleBlockPrefix('- [ ] ') },
      { icon: <Quote size={15} />, label: 'Blockquote (⌘⇧.)', action: () => toggleBlockPrefix('> ') },
      { icon: <Minus size={15} />, label: 'Horizontal rule', action: () => insertAtCursor('\n---\n') },
    ],
    [
      { icon: <Link size={15} />, label: 'Link (⌘K)', action: () => applyInlineWrap('[', '](url)') },
      { icon: <Image size={15} />, label: 'Insert image', action: handleImageToolbar },
      { icon: <Table size={15} />, label: 'Insert table', action: insertTable },
    ],
  ];

  const floatingButtons = [
    { icon: <Bold size={14} />, label: 'Bold', action: () => applyInlineWrap('**', '**') },
    { icon: <Italic size={14} />, label: 'Italic', action: () => applyInlineWrap('*', '*') },
    { icon: <Strikethrough size={14} />, label: 'Strikethrough', action: () => applyInlineWrap('~~', '~~') },
    { icon: <Code size={14} />, label: 'Code', action: () => applyInlineWrap('`', '`') },
    { icon: <Link size={14} />, label: 'Link', action: () => applyInlineWrap('[', '](url)') },
  ];

  const slashMenuPosition =
    slash && typeof window !== 'undefined'
      ? getSlashMenuPosition(slash.rect)
      : null;

  const floatingToolbarPosition =
    floatingRect && typeof window !== 'undefined'
      ? getFloatingToolbarPosition(floatingRect)
      : null;

  const slashMenu =
    showSlashMenu &&
    !readOnly &&
    slash &&
    slashMenuPosition &&
    typeof document !== 'undefined'
      ? createPortal(
          <SlashMenu
            items={filterSlashItems(slashCommands, slash.query)}
            activeIndex={slash.activeIndex}
            top={slashMenuPosition.top}
            left={slashMenuPosition.left}
            onSelect={executeSlashCommand}
            onHoverIndex={(i) => {
              if (!slashRef.current) return;
              updateSlash({ ...slashRef.current, activeIndex: i });
            }}
          />,
          document.body,
        )
      : null;

  const floatingToolbar =
    showFloatingToolbar &&
    !readOnly &&
    floatingToolbarPosition &&
    typeof document !== 'undefined'
      ? createPortal(
          <div
            className="orot-md-floating-toolbar"
            role="toolbar"
            aria-label="Selection formatting"
            style={{
              top: floatingToolbarPosition.top,
              left: floatingToolbarPosition.left,
            }}
          >
            {floatingButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                className="orot-md-floating-btn"
                title={btn.label}
                aria-label={btn.label}
                onMouseDown={(e) => {
                  e.preventDefault();
                  btn.action();
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  const imagePreviewOverlay =
    imagePreview && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="orot-md-image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={imagePreview.alt || 'Image preview'}
            onClick={closeImagePreview}
          >
            <div
              className="orot-md-image-lightbox__content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imagePreview.src}
                alt={imagePreview.alt}
                className="orot-md-image-lightbox__img"
                draggable={false}
              />
              {imagePreview.alt && (
                <div className="orot-md-image-lightbox__caption">
                  {imagePreview.alt}
                </div>
              )}
            </div>
            <button
              type="button"
              className="orot-md-image-lightbox__close"
              aria-label="Close image preview"
              onClick={closeImagePreview}
            >
              ✕
            </button>
          </div>,
          document.body,
        )
      : null;

  // ── Render ───────────────────────────────────────────

  return (
    <div
      className={[
        'orot-md-editor',
        readOnly && 'orot-md-editor--readonly',
        (readOnly || !isFocused) && 'orot-md-editor--preview',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false);
          setFloatingRect(null);
          if (slashRef.current) updateSlash(null);
        }
      }}
    >
      {showToolbar && !readOnly && (
        <div className="orot-md-toolbar" role="toolbar" aria-label="Formatting toolbar">
          {toolbarGroups.map((group, gi) => (
            <span key={gi} className="orot-md-toolbar-group">
              {group.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  className="orot-md-toolbar-btn"
                  title={btn.label}
                  aria-label={btn.label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    btn.action();
                  }}
                >
                  {btn.icon}
                </button>
              ))}
              {gi < toolbarGroups.length - 1 && (
                <span className="orot-md-toolbar-sep" role="separator" />
              )}
            </span>
          ))}
        </div>
      )}

      <div
        ref={wrapperRef}
        style={{ position: 'relative', display: 'flex', flex: 1, minHeight: 0 }}
      >
        <div
          ref={editorRef}
          className="orot-md-content"
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onMouseDownCapture={handleContentMouseDownCapture}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          data-placeholder={isEmpty ? placeholder : undefined}
          style={{
            minHeight: toCSS(minHeight),
            maxHeight: toCSS(maxHeight),
          }}
          aria-label="Markdown editor"
          aria-multiline="true"
          role="textbox"
          spellCheck
        />
      </div>

      {showWordCount && (
        <div className="orot-md-footer">
          <span>
            {stats.words} {stats.words === 1 ? 'word' : 'words'} · {stats.chars} chars
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      {slashMenu}
      {floatingToolbar}
      {imagePreviewOverlay}
    </div>
  );
}

// ── Utility ───────────────────────────────────────────

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
