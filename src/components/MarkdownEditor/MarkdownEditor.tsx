import {
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
import { renderMarkdown, findImageRangeForDeletion } from './parser';
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
    nextImg.replaceWith(savedImg);

    if (bucket && bucket.length === 0) {
      preserved.delete(key);
    }
  });
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
  onHashtagClick,
  className = '',
  style,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<string>(value ?? defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<{ words: number; chars: number }>({
    words: 0,
    chars: 0,
  });
  const [isEmpty, setIsEmpty] = useState(!rawRef.current);
  const [isFocused, setIsFocused] = useState(false);
  const [floatingRect, setFloatingRect] = useState<ViewportRect | null>(null);
  const [slash, setSlash] = useState<SlashState | null>(null);
  const slashRef = useRef<SlashState | null>(null);

  const updateSlash = useCallback((next: SlashState | null) => {
    slashRef.current = next;
    setSlash(next);
  }, []);

  // ── Helpers ─────────────────────────────────────────

  const updateStats = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setStats({ words, chars: text.length });
    setIsEmpty(!text);
  };

  const applyHTML = useCallback(
    (
      el: HTMLDivElement,
      text: string,
      sel: SelectionRange | CursorPos | null,
    ) => {
      const html =
        renderMarkdown(text) || '<div class="orot-md-line" data-line="0"><br></div>';
      const preservedImages = captureRenderedImages(el);
      el.innerHTML = html;
      restoreRenderedImages(el, preservedImages);

      if (sel && 'start' in sel) {
        restoreSelection(el, sel as SelectionRange);
      } else {
        restoreCursor(el, sel as CursorPos | null);
      }
      updateStats(text);
    },
    [],
  );

  const commit = useCallback(
    (text: string, sel: SelectionRange | CursorPos | null) => {
      const el = editorRef.current;
      if (!el) return;
      rawRef.current = text;
      applyHTML(el, text, sel);
      onChange?.(text);
    },
    [applyHTML, onChange],
  );

  // ── Initialize ───────────────────────────────────────

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    applyHTML(el, rawRef.current, null);
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
  }, [value, applyHTML]);

  // ── Input handler ────────────────────────────────────

  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const cursor = saveCursor(el);
    const text = getRawText(el);
    rawRef.current = text;
    applyHTML(el, text, cursor);
    onChange?.(text);

    if (!showSlashMenu || readOnly) return;
    const caret = saveCursor(el);
    if (!caret) return;
    const trigger = detectSlashTrigger(text, caret);
    if (!trigger) {
      if (slashRef.current) updateSlash(null);
      return;
    }
    const selectionRect = getSelectionRect();
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
  }, [applyHTML, onChange, showSlashMenu, readOnly, updateSlash]);

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
      const sel = saveSelection(el);
      if (!sel) return;
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
    [applyInlineWrap, toggleBlockPrefix, commit],
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

  // ── Click handler (task checkboxes + hashtags) ───────

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;

      // Task checkbox toggle
      const toggle = target.closest<HTMLElement>('[data-task-toggle]');
      if (toggle) {
        const el = editorRef.current;
        if (!el || readOnly) return;
        e.preventDefault();
        const lineIdx = parseInt(toggle.dataset.taskToggle ?? '-1', 10);
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

  const insertImage = useCallback(
    async (file: File) => {
      const el = editorRef.current;
      if (!el) return;
      const url = onImageUpload
        ? await onImageUpload(file)
        : await fileToDataURL(file);
      const cursor = saveCursor(el);
      const insertion = `![${file.name}](${url})`;
      const lines = rawRef.current.split('\n');
      const lineIdx = cursor?.lineIndex ?? 0;
      const line = lines[lineIdx] ?? '';
      const co = cursor?.charOffset ?? line.length;
      lines[lineIdx] = line.slice(0, co) + insertion + line.slice(co);
      commit(lines.join('\n'), {
        lineIndex: lineIdx,
        charOffset: co + insertion.length,
      });
      el.focus();
    },
    [commit, onImageUpload],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (!files.length) return;
      e.preventDefault();
      for (const file of files) await insertImage(file);
    },
    [insertImage],
  );

  const handleDragOver = (e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.items).some((i) => i.type.startsWith('image/'))) {
      e.preventDefault();
    }
  };

  const handleImageToolbar = () => fileInputRef.current?.click();

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';
      await insertImage(file);
    },
    [insertImage],
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
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      {slashMenu}
      {floatingToolbar}
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
