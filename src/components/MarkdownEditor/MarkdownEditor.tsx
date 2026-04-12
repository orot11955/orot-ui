import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
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
} from 'lucide-react';
import './MarkdownEditor.css';
import type { MarkdownEditorProps, CursorPos } from './MarkdownEditor.types';

// ── HTML escape ───────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Inline parser ─────────────────────────────────────
// Produces HTML; syntax markers are wrapped in <span class="orot-md-syntax">
// so they count toward character offsets just like the raw markdown text.

function parseInline(raw: string): string {
  if (!raw) return '';
  let result = '';
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    // Inline code: `code` — no nesting
    if (ch === '`') {
      const end = raw.indexOf('`', i + 1);
      if (end !== -1) {
        const content = raw.slice(i + 1, end);
        result += `<span class="orot-md-syntax">\`</span><code class="orot-md-inline-code">${esc(content)}</code><span class="orot-md-syntax">\`</span>`;
        i = end + 1;
        continue;
      }
    }

    // Bold: **text**
    if (ch === '*' && raw[i + 1] === '*') {
      const end = raw.indexOf('**', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">**</span><strong class="orot-md-bold">${parseInline(content)}</strong><span class="orot-md-syntax">**</span>`;
        i = end + 2;
        continue;
      }
    }

    // Bold: __text__
    if (ch === '_' && raw[i + 1] === '_') {
      const end = raw.indexOf('__', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">__</span><strong class="orot-md-bold">${parseInline(content)}</strong><span class="orot-md-syntax">__</span>`;
        i = end + 2;
        continue;
      }
    }

    // Italic: *text* (not **)
    if (ch === '*' && raw[i + 1] !== '*') {
      const end = findSingleClose(raw, i + 1, '*');
      if (end !== -1) {
        const content = raw.slice(i + 1, end);
        result += `<span class="orot-md-syntax">*</span><em class="orot-md-italic">${parseInline(content)}</em><span class="orot-md-syntax">*</span>`;
        i = end + 1;
        continue;
      }
    }

    // Italic: _text_ (not __)
    if (ch === '_' && raw[i + 1] !== '_') {
      const end = findSingleClose(raw, i + 1, '_');
      if (end !== -1) {
        const content = raw.slice(i + 1, end);
        result += `<span class="orot-md-syntax">_</span><em class="orot-md-italic">${parseInline(content)}</em><span class="orot-md-syntax">_</span>`;
        i = end + 1;
        continue;
      }
    }

    // Strikethrough: ~~text~~
    if (ch === '~' && raw[i + 1] === '~') {
      const end = raw.indexOf('~~', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">~~</span><s class="orot-md-strike">${parseInline(content)}</s><span class="orot-md-syntax">~~</span>`;
        i = end + 2;
        continue;
      }
    }

    // Highlight: ==text==
    if (ch === '=' && raw[i + 1] === '=') {
      const end = raw.indexOf('==', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">==</span><mark class="orot-md-highlight">${parseInline(content)}</mark><span class="orot-md-syntax">==</span>`;
        i = end + 2;
        continue;
      }
    }

    // Image: ![alt](url)
    if (ch === '!' && raw[i + 1] === '[') {
      const altEnd = raw.indexOf(']', i + 2);
      if (altEnd !== -1 && raw[altEnd + 1] === '(') {
        const urlEnd = raw.indexOf(')', altEnd + 2);
        if (urlEnd !== -1) {
          const alt = raw.slice(i + 2, altEnd);
          const url = raw.slice(altEnd + 2, urlEnd);
          result += `<span class="orot-md-syntax">![${esc(alt)}](${esc(url)})</span>`;
          i = urlEnd + 1;
          continue;
        }
      }
    }

    // Link: [text](url)
    if (ch === '[') {
      const textEnd = raw.indexOf(']', i + 1);
      if (textEnd !== -1 && raw[textEnd + 1] === '(') {
        const urlEnd = raw.indexOf(')', textEnd + 2);
        if (urlEnd !== -1) {
          const linkText = raw.slice(i + 1, textEnd);
          const url = raw.slice(textEnd + 2, urlEnd);
          result += `<span class="orot-md-syntax">[</span><a href="${esc(url)}" class="orot-md-link" target="_blank" rel="noopener noreferrer">${parseInline(linkText)}</a><span class="orot-md-syntax">](${esc(url)})</span>`;
          i = urlEnd + 1;
          continue;
        }
      }
    }

    // Default: escape the character
    result +=
      ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch;
    i++;
  }

  return result;
}

function findSingleClose(text: string, start: number, char: string): number {
  for (let i = start; i < text.length; i++) {
    if (text[i] === char && text[i + 1] !== char) return i;
  }
  return -1;
}

// ── Block parser ──────────────────────────────────────

export function renderMarkdown(rawText: string): string {
  const lines = rawText.split('\n');
  let inCodeBlock = false;
  let isFirst = true;

  const rendered = lines.map((line) => {
    // Code fence toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const html = `<div class="orot-md-line orot-md-code-fence-end"><span class="orot-md-code-line">${esc(line)}</span></div>`;
        isFirst = false;
        return html;
      } else {
        inCodeBlock = true;
        const html = `<div class="orot-md-line orot-md-code-fence-start"><span class="orot-md-code-line">${esc(line)}</span></div>`;
        isFirst = false;
        return html;
      }
    }

    // Inside code block
    if (inCodeBlock) {
      const html = `<div class="orot-md-line orot-md-code-content"><span class="orot-md-code-line">${esc(line) || '\u200b'}</span></div>`;
      isFirst = false;
      return html;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6}) (.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const html = `<div class="orot-md-line orot-md-h${level}"><span class="orot-md-syntax orot-md-heading-marker">${esc(headingMatch[1])} </span>${parseInline(content)}</div>`;
      isFirst = false;
      return html;
    }

    // Blockquote
    if (line.startsWith('> ') || line === '>') {
      const content = line.startsWith('> ') ? line.slice(2) : '';
      const html = `<div class="orot-md-line orot-md-blockquote"><span class="orot-md-syntax">&gt; </span>${parseInline(content)}</div>`;
      isFirst = false;
      return html;
    }

    // Task list
    const taskMatch = line.match(/^(\s*)-\s\[([ xX])\] (.*)$/);
    if (taskMatch) {
      const indent = taskMatch[1];
      const checked = taskMatch[2].toLowerCase() === 'x';
      const content = taskMatch[3];
      const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
      const html = `<div class="orot-md-line orot-md-task ${depthClass}${checked ? ' orot-md-task--done' : ''}"><span class="orot-md-syntax">${esc(indent)}- [${esc(taskMatch[2])}] </span>${parseInline(content)}</div>`;
      isFirst = false;
      return html;
    }

    // Unordered list
    const ulMatch = line.match(/^(\s*)[-*+] (.*)$/);
    if (ulMatch) {
      const indent = ulMatch[1];
      const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
      const html = `<div class="orot-md-line orot-md-list ${depthClass}"><span class="orot-md-syntax">${esc(indent)}- </span>${parseInline(ulMatch[2])}</div>`;
      isFirst = false;
      return html;
    }

    // Ordered list
    const olMatch = line.match(/^(\s*)(\d+)\. (.*)$/);
    if (olMatch) {
      const indent = olMatch[1];
      const num = olMatch[2];
      const html = `<div class="orot-md-line orot-md-list-ordered"><span class="orot-md-syntax">${esc(indent)}${esc(num)}. </span>${parseInline(olMatch[3])}</div>`;
      isFirst = false;
      return html;
    }

    // Horizontal rule
    if (line.match(/^(---|\*\*\*|___)$/)) {
      const html = `<div class="orot-md-line orot-md-hr" aria-hidden="true"><span class="orot-md-syntax">${esc(line)}</span></div>`;
      isFirst = false;
      return html;
    }

    // Empty line
    if (line === '') {
      isFirst = false;
      return `<div class="orot-md-line"><br></div>`;
    }

    // Regular paragraph
    const html = `<div class="orot-md-line">${parseInline(line)}</div>`;
    isFirst = false;
    return html;
  });

  // suppress "isFirst" lint warning — it's used as a mutable counter
  void isFirst;
  return rendered.join('');
}

// ── Cursor helpers ────────────────────────────────────

function saveCursor(root: HTMLElement): CursorPos | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  const lines = Array.from(root.children) as HTMLElement[];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line.contains(range.startContainer) && line !== range.startContainer)
      continue;

    let charOffset = 0;
    let found = false;

    function countInLine(node: Node): boolean {
      if (found) return true;
      if (node === range.startContainer) {
        if (node.nodeType === Node.TEXT_NODE) {
          charOffset += range.startOffset;
        } else {
          // Element node as container: count children up to startOffset
          const kids = Array.from(node.childNodes);
          for (let k = 0; k < range.startOffset && k < kids.length; k++) {
            charOffset += nodeTextLength(kids[k]);
          }
        }
        found = true;
        return true;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        charOffset += (node as Text).length;
        return false;
      }
      const el = node as HTMLElement;
      if (el.tagName === 'BR') return false;
      for (const child of Array.from(node.childNodes)) {
        if (countInLine(child)) return true;
      }
      return false;
    }

    countInLine(line);
    return { lineIndex, charOffset };
  }

  return null;
}

function nodeTextLength(node: Node): number {
  if (node.nodeType === Node.TEXT_NODE) return (node as Text).length;
  if ((node as HTMLElement).tagName === 'BR') return 0;
  let len = 0;
  for (const child of Array.from(node.childNodes)) len += nodeTextLength(child);
  return len;
}

function findNodeAtOffset(
  root: Node,
  remaining: number,
): { node: Node; offset: number } | null {
  if (root.nodeType === Node.TEXT_NODE) {
    const text = root as Text;
    if (remaining <= text.length) return { node: root, offset: remaining };
    return null;
  }
  const el = root as HTMLElement;
  if (el.tagName === 'BR') return null;

  let rem = remaining;
  for (const child of Array.from(root.childNodes)) {
    const childLen = nodeTextLength(child);
    if (rem <= childLen) {
      return findNodeAtOffset(child, rem);
    }
    rem -= childLen;
  }
  return null;
}

function restoreCursor(root: HTMLElement, pos: CursorPos | null): void {
  if (!pos) return;
  const lines = Array.from(root.children) as HTMLElement[];
  const lineEl = lines[Math.min(pos.lineIndex, lines.length - 1)];
  if (!lineEl) return;

  const found = findNodeAtOffset(lineEl, pos.charOffset);

  const range = document.createRange();
  const sel = window.getSelection();
  if (!sel) return;

  if (found) {
    range.setStart(found.node, found.offset);
  } else {
    // Fallback: end of line
    range.selectNodeContents(lineEl);
    range.collapse(false);
  }

  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

// ── Get raw text from contenteditable ────────────────

function getRawText(root: HTMLElement): string {
  const lines = Array.from(root.children) as HTMLElement[];
  return lines
    .map((line) => line.textContent ?? '')
    .join('\n')
    // Collapse invisible zero-width spaces we use for empty code lines
    .replace(/\u200b/g, '');
}

// ── Component ─────────────────────────────────────────

export function MarkdownEditor({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Start writing...',
  readOnly = false,
  showToolbar = true,
  showWordCount = true,
  minHeight = 320,
  maxHeight,
  autoFocus = false,
  onImageUpload,
  className = '',
  style,
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<string>(value ?? defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<{ words: number; chars: number }>({
    words: 0,
    chars: 0,
  });
  const [isEmpty, setIsEmpty] = useState(!rawRef.current);

  // ── Helpers ─────────────────────────────────────────

  const updateStats = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setStats({ words, chars: text.length });
    setIsEmpty(!text);
  };

  const applyHTML = useCallback(
    (el: HTMLDivElement, text: string, cursor: CursorPos | null) => {
      const html =
        renderMarkdown(text) || '<div class="orot-md-line"><br></div>';
      el.innerHTML = html;
      restoreCursor(el, cursor);
      updateStats(text);
    },
    [],
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
  }, [applyHTML, onChange]);

  // ── Toolbar format helpers ───────────────────────────

  const applyInlineWrap = useCallback(
    (openMark: string, closeMark: string) => {
      const el = editorRef.current;
      if (!el) return;
      const cursor = saveCursor(el);
      if (!cursor) return;

      const lines = rawRef.current.split('\n');
      const line = lines[cursor.lineIndex] ?? '';
      const newLine =
        line.slice(0, cursor.charOffset) +
        openMark +
        closeMark +
        line.slice(cursor.charOffset);
      lines[cursor.lineIndex] = newLine;
      const newText = lines.join('\n');
      rawRef.current = newText;
      applyHTML(el, newText, {
        lineIndex: cursor.lineIndex,
        charOffset: cursor.charOffset + openMark.length,
      });
      onChange?.(newText);
      el.focus();
    },
    [applyHTML, onChange],
  );

  const toggleBlockPrefix = useCallback(
    (prefix: string) => {
      const el = editorRef.current;
      if (!el) return;
      const cursor = saveCursor(el);
      if (!cursor) return;

      const lines = rawRef.current.split('\n');
      const line = lines[cursor.lineIndex] ?? '';
      let newLine: string;
      let newOffset: number;

      if (line.startsWith(prefix)) {
        newLine = line.slice(prefix.length);
        newOffset = Math.max(0, cursor.charOffset - prefix.length);
      } else {
        newLine = prefix + line;
        newOffset = cursor.charOffset + prefix.length;
      }

      lines[cursor.lineIndex] = newLine;
      const newText = lines.join('\n');
      rawRef.current = newText;
      applyHTML(el, newText, { lineIndex: cursor.lineIndex, charOffset: newOffset });
      onChange?.(newText);
      el.focus();
    },
    [applyHTML, onChange],
  );

  // ── Keyboard handler ─────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = editorRef.current;
      if (!el) return;

      // ── Enter ──────────────────────────────────────
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const cursor = saveCursor(el);
        if (!cursor) return;

        const lines = rawRef.current.split('\n');
        const line = lines[cursor.lineIndex] ?? '';
        const before = line.slice(0, cursor.charOffset);
        const after = line.slice(cursor.charOffset);

        // Auto-continue list markers
        let newPrefix = '';
        const taskMatch = line.match(/^(\s*)-\s\[[ xX]\] /);
        const ulMatch = line.match(/^(\s*)[-*+] /);
        const olMatch = line.match(/^(\s*)(\d+)\. /);

        if (taskMatch) {
          if (line.trim() === taskMatch[0].trim()) {
            lines[cursor.lineIndex] = '';
          } else {
            newPrefix = `${taskMatch[1]}- [ ] `;
          }
        } else if (ulMatch) {
          if (line.trim() === ulMatch[0].trim()) {
            lines[cursor.lineIndex] = '';
          } else {
            newPrefix = `${ulMatch[1]}- `;
          }
        } else if (olMatch) {
          if (line.trim() === olMatch[0].trim()) {
            lines[cursor.lineIndex] = '';
          } else {
            newPrefix = `${olMatch[1]}${parseInt(olMatch[2]) + 1}. `;
          }
        }

        if (lines[cursor.lineIndex] !== '') {
          lines[cursor.lineIndex] = before;
          lines.splice(cursor.lineIndex + 1, 0, newPrefix + after);
        }

        const newText = lines.join('\n');
        rawRef.current = newText;
        applyHTML(el, newText, {
          lineIndex: cursor.lineIndex + 1,
          charOffset: newPrefix.length,
        });
        onChange?.(newText);
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
        const newText = lines.join('\n');
        rawRef.current = newText;
        applyHTML(el, newText, { lineIndex: cursor.lineIndex + 1, charOffset: 0 });
        onChange?.(newText);
        return;
      }

      // ── Tab / Shift+Tab ───────────────────────────
      if (e.key === 'Tab') {
        e.preventDefault();
        const cursor = saveCursor(el);
        if (!cursor) return;
        const lines = rawRef.current.split('\n');
        const line = lines[cursor.lineIndex] ?? '';

        if (e.shiftKey) {
          if (line.startsWith('  ')) {
            lines[cursor.lineIndex] = line.slice(2);
            const newText = lines.join('\n');
            rawRef.current = newText;
            applyHTML(el, newText, {
              lineIndex: cursor.lineIndex,
              charOffset: Math.max(0, cursor.charOffset - 2),
            });
            onChange?.(newText);
          }
        } else {
          lines[cursor.lineIndex] = '  ' + line;
          const newText = lines.join('\n');
          rawRef.current = newText;
          applyHTML(el, newText, {
            lineIndex: cursor.lineIndex,
            charOffset: cursor.charOffset + 2,
          });
          onChange?.(newText);
        }
        return;
      }

      // ── Cmd/Ctrl shortcuts ────────────────────────
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'b') {
        e.preventDefault();
        applyInlineWrap('**', '**');
        return;
      }
      if (mod && e.key === 'i') {
        e.preventDefault();
        applyInlineWrap('*', '*');
        return;
      }
      if (mod && e.key === 'k') {
        e.preventDefault();
        applyInlineWrap('[', '](url)');
        return;
      }
      if (mod && e.key === 'e') {
        e.preventDefault();
        applyInlineWrap('`', '`');
        return;
      }
    },
    [applyHTML, applyInlineWrap, onChange],
  );

  // ── Paste handler ────────────────────────────────────

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const el = editorRef.current;
      if (!el) return;

      const cursor = saveCursor(el);
      const pastedText = e.clipboardData.getData('text/plain');
      if (!pastedText) return;

      const allLines = rawRef.current.split('\n');
      const currentLine = allLines[cursor?.lineIndex ?? 0] ?? '';
      const beforeCursor = currentLine.slice(0, cursor?.charOffset ?? currentLine.length);
      const afterCursor = currentLine.slice(cursor?.charOffset ?? currentLine.length);
      const pastedLines = pastedText.split('\n');

      const replacementLines =
        pastedLines.length === 1
          ? [beforeCursor + pastedLines[0] + afterCursor]
          : [
              beforeCursor + pastedLines[0],
              ...pastedLines.slice(1, -1),
              pastedLines[pastedLines.length - 1] + afterCursor,
            ];

      const lineIndex = cursor?.lineIndex ?? 0;
      allLines.splice(lineIndex, 1, ...replacementLines);
      const newText = allLines.join('\n');
      rawRef.current = newText;

      const newLineIndex = lineIndex + pastedLines.length - 1;
      const newCharOffset =
        pastedLines.length === 1
          ? beforeCursor.length + pastedLines[0].length
          : pastedLines[pastedLines.length - 1].length;

      applyHTML(el, newText, { lineIndex: newLineIndex, charOffset: newCharOffset });
      onChange?.(newText);
    },
    [applyHTML, onChange],
  );

  // ── Drag-and-drop images ─────────────────────────────

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (!files.length) return;
      e.preventDefault();

      for (const file of files) {
        let url: string;
        if (onImageUpload) {
          url = await onImageUpload(file);
        } else {
          url = await fileToDataURL(file);
        }
        const el = editorRef.current;
        if (!el) continue;
        const cursor = saveCursor(el);
        const insertion = `![${file.name}](${url})`;
        const lines = rawRef.current.split('\n');
        const line = lines[cursor?.lineIndex ?? 0] ?? '';
        const charOffset = cursor?.charOffset ?? line.length;
        lines[cursor?.lineIndex ?? 0] =
          line.slice(0, charOffset) + insertion + line.slice(charOffset);
        const newText = lines.join('\n');
        rawRef.current = newText;
        applyHTML(el, newText, {
          lineIndex: cursor?.lineIndex ?? 0,
          charOffset: charOffset + insertion.length,
        });
        onChange?.(newText);
      }
    },
    [applyHTML, onChange, onImageUpload],
  );

  const handleDragOver = (e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.items).some((i) => i.type.startsWith('image/'))) {
      e.preventDefault();
    }
  };

  // ── Image toolbar button ──────────────────────────────

  const handleImageToolbar = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      let url: string;
      if (onImageUpload) {
        url = await onImageUpload(file);
      } else {
        url = await fileToDataURL(file);
      }

      const el = editorRef.current;
      if (!el) return;
      const cursor = saveCursor(el);
      const insertion = `![${file.name}](${url})`;
      const lines = rawRef.current.split('\n');
      const lineIdx = cursor?.lineIndex ?? 0;
      const line = lines[lineIdx] ?? '';
      const co = cursor?.charOffset ?? line.length;
      lines[lineIdx] = line.slice(0, co) + insertion + line.slice(co);
      const newText = lines.join('\n');
      rawRef.current = newText;
      applyHTML(el, newText, {
        lineIndex: lineIdx,
        charOffset: co + insertion.length,
      });
      onChange?.(newText);
      el.focus();
    },
    [applyHTML, onChange, onImageUpload],
  );

  // ── CSS size values ──────────────────────────────────

  const toCSS = (v: number | string | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

  // ── Toolbar config ───────────────────────────────────

  const toolbarGroups = [
    [
      { icon: <Heading1 size={15} />, label: 'Heading 1', action: () => toggleBlockPrefix('# ') },
      { icon: <Heading2 size={15} />, label: 'Heading 2', action: () => toggleBlockPrefix('## ') },
      { icon: <Heading3 size={15} />, label: 'Heading 3', action: () => toggleBlockPrefix('### ') },
    ],
    [
      { icon: <Bold size={15} />, label: 'Bold (⌘B)', action: () => applyInlineWrap('**', '**') },
      { icon: <Italic size={15} />, label: 'Italic (⌘I)', action: () => applyInlineWrap('*', '*') },
      { icon: <Strikethrough size={15} />, label: 'Strikethrough', action: () => applyInlineWrap('~~', '~~') },
      { icon: <Code size={15} />, label: 'Inline code (⌘E)', action: () => applyInlineWrap('`', '`') },
    ],
    [
      { icon: <List size={15} />, label: 'Unordered list', action: () => toggleBlockPrefix('- ') },
      { icon: <ListOrdered size={15} />, label: 'Ordered list', action: () => toggleBlockPrefix('1. ') },
      { icon: <CheckSquare size={15} />, label: 'Task list', action: () => toggleBlockPrefix('- [ ] ') },
      { icon: <Quote size={15} />, label: 'Blockquote', action: () => toggleBlockPrefix('> ') },
      { icon: <Minus size={15} />, label: 'Horizontal rule', action: () => applyInlineWrap('', '\n---\n') },
    ],
    [
      { icon: <Link size={15} />, label: 'Link (⌘K)', action: () => applyInlineWrap('[', '](url)') },
      { icon: <Image size={15} />, label: 'Insert image', action: handleImageToolbar },
    ],
  ];

  // ── Render ───────────────────────────────────────────

  return (
    <div
      className={['orot-md-editor', className].filter(Boolean).join(' ')}
      style={style}
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
                    // Prevent blur on editor
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
        ref={editorRef}
        className="orot-md-content"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
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

      {showWordCount && (
        <div className="orot-md-footer">
          <span>
            {stats.words} {stats.words === 1 ? 'word' : 'words'} · {stats.chars} chars
          </span>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
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
