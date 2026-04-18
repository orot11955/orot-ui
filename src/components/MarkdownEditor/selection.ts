import type { CursorPos, SelectionRange } from './MarkdownEditor.types';

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

function posForContainer(
  lines: HTMLElement[],
  container: Node,
  offset: number,
): CursorPos | null {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    if (!line.contains(container) && line !== container) continue;

    let charOffset = 0;
    let found = false;

    function walk(node: Node): boolean {
      if (found) return true;
      if (node === container) {
        if (node.nodeType === Node.TEXT_NODE) {
          charOffset += offset;
        } else {
          const kids = Array.from(node.childNodes);
          for (let k = 0; k < offset && k < kids.length; k++) {
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
        if (walk(child)) return true;
      }
      return false;
    }

    walk(line);
    return { lineIndex, charOffset };
  }
  return null;
}

export function saveCursor(root: HTMLElement): CursorPos | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const lines = Array.from(root.children) as HTMLElement[];
  return posForContainer(lines, range.startContainer, range.startOffset);
}

export function saveSelection(root: HTMLElement): SelectionRange | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  const lines = Array.from(root.children) as HTMLElement[];
  const start = posForContainer(lines, range.startContainer, range.startOffset);
  if (!start) return null;
  if (range.collapsed) {
    return { start, end: start, collapsed: true };
  }
  const end = posForContainer(lines, range.endContainer, range.endOffset);
  if (!end) return { start, end: start, collapsed: true };
  return { start, end, collapsed: false };
}

export function restoreCursor(root: HTMLElement, pos: CursorPos | null): void {
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
    range.selectNodeContents(lineEl);
    range.collapse(false);
  }

  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function restoreSelection(
  root: HTMLElement,
  selRange: SelectionRange | null,
): void {
  if (!selRange) return;
  if (selRange.collapsed) {
    restoreCursor(root, selRange.start);
    return;
  }
  const lines = Array.from(root.children) as HTMLElement[];
  const startLine = lines[Math.min(selRange.start.lineIndex, lines.length - 1)];
  const endLine = lines[Math.min(selRange.end.lineIndex, lines.length - 1)];
  if (!startLine || !endLine) return;

  const startFound = findNodeAtOffset(startLine, selRange.start.charOffset);
  const endFound = findNodeAtOffset(endLine, selRange.end.charOffset);

  const range = document.createRange();
  const sel = window.getSelection();
  if (!sel) return;

  if (startFound) {
    range.setStart(startFound.node, startFound.offset);
  } else {
    range.selectNodeContents(startLine);
    range.collapse(true);
  }

  if (endFound) {
    range.setEnd(endFound.node, endFound.offset);
  } else {
    range.selectNodeContents(endLine);
    range.collapse(false);
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

export function getRawText(root: HTMLElement): string {
  const lines = Array.from(root.children) as HTMLElement[];
  return lines
    .map((line) => line.textContent ?? '')
    .join('\n')
    .replace(/\u200b/g, '');
}
