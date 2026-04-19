import type { MarkdownEditorResolveImageSource } from './MarkdownEditor.types';

// ── HTML escape ───────────────────────────────────────

export function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escAttr(text: string): string {
  return esc(text)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Inline parser ─────────────────────────────────────
// Produces HTML; syntax markers are wrapped in <span class="orot-md-syntax">
// so they count toward character offsets just like the raw markdown text.

const URL_RE = /^(https?:\/\/|www\.)[^\s<>()[\]{}'"]+/i;
const HASHTAG_RE = /^[\p{L}\p{N}][\p{L}\p{N}_-]*/u;

export interface MarkdownRenderOptions {
  resolveImageSource?: MarkdownEditorResolveImageSource;
  getImageSize?: (
    url: string,
    displaySrc: string,
    previewSrc: string,
    alt: string,
  ) => { width: number; height: number } | null | undefined;
  cache?: {
    get: (key: string) => string[] | undefined;
    set: (key: string, lines: string[]) => void;
  };
}

function isWordBoundary(ch: string | undefined): boolean {
  if (ch === undefined) return true;
  return !/[\p{L}\p{N}_]/u.test(ch);
}

export function parseInline(
  raw: string,
  options: MarkdownRenderOptions = {},
): string {
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
        result += `<span class="orot-md-syntax">**</span><strong class="orot-md-bold">${parseInline(content, options)}</strong><span class="orot-md-syntax">**</span>`;
        i = end + 2;
        continue;
      }
    }

    // Bold: __text__
    if (ch === '_' && raw[i + 1] === '_') {
      const end = raw.indexOf('__', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">__</span><strong class="orot-md-bold">${parseInline(content, options)}</strong><span class="orot-md-syntax">__</span>`;
        i = end + 2;
        continue;
      }
    }

    // Italic: *text* (not **)
    if (ch === '*' && raw[i + 1] !== '*') {
      const end = findSingleClose(raw, i + 1, '*');
      if (end !== -1) {
        const content = raw.slice(i + 1, end);
        result += `<span class="orot-md-syntax">*</span><em class="orot-md-italic">${parseInline(content, options)}</em><span class="orot-md-syntax">*</span>`;
        i = end + 1;
        continue;
      }
    }

    // Italic: _text_ (not __) — require word boundary around it
    if (ch === '_' && raw[i + 1] !== '_' && isWordBoundary(raw[i - 1])) {
      const end = findSingleClose(raw, i + 1, '_');
      if (end !== -1 && isWordBoundary(raw[end + 1])) {
        const content = raw.slice(i + 1, end);
        result += `<span class="orot-md-syntax">_</span><em class="orot-md-italic">${parseInline(content, options)}</em><span class="orot-md-syntax">_</span>`;
        i = end + 1;
        continue;
      }
    }

    // Strikethrough: ~~text~~
    if (ch === '~' && raw[i + 1] === '~') {
      const end = raw.indexOf('~~', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">~~</span><s class="orot-md-strike">${parseInline(content, options)}</s><span class="orot-md-syntax">~~</span>`;
        i = end + 2;
        continue;
      }
    }

    // Highlight: ==text==
    if (ch === '=' && raw[i + 1] === '=') {
      const end = raw.indexOf('==', i + 2);
      if (end !== -1 && end > i + 2) {
        const content = raw.slice(i + 2, end);
        result += `<span class="orot-md-syntax">==</span><mark class="orot-md-highlight">${parseInline(content, options)}</mark><span class="orot-md-syntax">==</span>`;
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
          const resolved = options.resolveImageSource?.(url, alt);
          const displaySrc = resolved?.displaySrc || url;
          const previewSrc = resolved?.previewSrc || url;
          const cachedSize = options.getImageSize?.(
            url,
            displaySrc,
            previewSrc,
            alt,
          );
          const width =
            typeof resolved?.width === 'number' && resolved.width > 0
              ? Math.round(resolved.width)
              : typeof cachedSize?.width === 'number' && cachedSize.width > 0
                ? Math.round(cachedSize.width)
              : null;
          const height =
            typeof resolved?.height === 'number' && resolved.height > 0
              ? Math.round(resolved.height)
              : typeof cachedSize?.height === 'number' && cachedSize.height > 0
                ? Math.round(cachedSize.height)
              : null;
          const dimensionAttrs =
            width !== null && height !== null
              ? ` width="${width}" height="${height}"`
              : '';
          result += `<span class="orot-md-image" data-image-src="${escAttr(url)}" data-image-preview-src="${escAttr(previewSrc)}" data-image-alt="${escAttr(alt)}"><span class="orot-md-image-token orot-md-syntax">![${esc(alt)}](${esc(url)})</span><span class="orot-md-image-preview" contenteditable="false"><img src="${escAttr(displaySrc)}" alt="${escAttr(alt)}" class="orot-md-image-preview__img" loading="lazy" decoding="async" draggable="false"${dimensionAttrs} /></span></span>`;
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
          result += `<span class="orot-md-syntax">[</span><a href="${escAttr(url)}" class="orot-md-link" target="_blank" rel="noopener noreferrer">${parseInline(linkText, options)}</a><span class="orot-md-syntax">](${esc(url)})</span>`;
          i = urlEnd + 1;
          continue;
        }
      }
    }

    // Autolink: bare http(s)://... or www.
    if ((ch === 'h' || ch === 'H' || ch === 'w' || ch === 'W') && isWordBoundary(raw[i - 1])) {
      const m = raw.slice(i).match(URL_RE);
      if (m) {
        // Trim trailing punctuation commonly outside URLs
        let url = m[0].replace(/[.,!?:;]+$/, '');
        if (url.length >= 8 || url.startsWith('www.')) {
          const href = url.startsWith('www.') ? `http://${url}` : url;
          result += `<a href="${escAttr(href)}" class="orot-md-link orot-md-autolink" target="_blank" rel="noopener noreferrer">${esc(url)}</a>`;
          i += url.length;
          continue;
        }
      }
    }

    // Hashtag: #tag
    if (ch === '#' && isWordBoundary(raw[i - 1])) {
      const m = raw.slice(i + 1).match(HASHTAG_RE);
      if (m) {
        const tag = m[0];
        result += `<span class="orot-md-hashtag" data-tag="${escAttr(tag)}">#${esc(tag)}</span>`;
        i += 1 + tag.length;
        continue;
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

export function findImageRangeForDeletion(
  line: string,
  charOffset: number,
  direction: 'backward' | 'forward',
): { start: number; end: number } | null {
  const matches = line.matchAll(/!\[[^\]]*]\([^)\n]*\)/g);

  for (const match of matches) {
    const start = match.index ?? -1;
    if (start === -1) continue;
    const token = match[0];
    const end = start + token.length;

    if (direction === 'backward') {
      if (charOffset === end || (charOffset > start && charOffset <= end)) {
        return { start, end };
      }
      continue;
    }

    if (charOffset === start || (charOffset >= start && charOffset < end)) {
      return { start, end };
    }
  }

  return null;
}

// ── Code block syntax highlighter ─────────────────────

type TokenRule = { cls: string; re: RegExp };

const STRING_RE: RegExp = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/y;
const NUMBER_RE: RegExp = /\b\d+(?:\.\d+)?\b/y;

function rulesFor(lang: string): TokenRule[] {
  const l = lang.toLowerCase();
  if (['js', 'jsx', 'javascript', 'ts', 'tsx', 'typescript'].includes(l)) {
    return [
      { cls: 'com', re: /\/\/.*/y },
      { cls: 'com', re: /\/\*[\s\S]*?\*\//y },
      { cls: 'str', re: STRING_RE },
      {
        cls: 'kw',
        re: /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|default|break|continue|new|this|class|extends|super|import|export|from|as|async|await|yield|try|catch|finally|throw|typeof|instanceof|in|of|delete|void|null|undefined|true|false|interface|type|enum|implements|public|private|protected|readonly|static)\b/y,
      },
      { cls: 'num', re: NUMBER_RE },
      { cls: 'fn', re: /\b[A-Za-z_$][\w$]*(?=\s*\()/y },
    ];
  }
  if (['html', 'xml', 'svg'].includes(l)) {
    return [
      { cls: 'com', re: /<!--[\s\S]*?-->/y },
      { cls: 'tag', re: /<\/?[A-Za-z][\w-]*/y },
      { cls: 'tag', re: /\/?>/y },
      { cls: 'attr', re: /(?<=\s)[A-Za-z_:][\w.:-]*(?=\s*=)/y },
      { cls: 'str', re: STRING_RE },
    ];
  }
  if (['css', 'scss', 'less'].includes(l)) {
    return [
      { cls: 'com', re: /\/\*[\s\S]*?\*\//y },
      { cls: 'kw', re: /@[A-Za-z-]+/y },
      { cls: 'str', re: STRING_RE },
      { cls: 'num', re: /\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|deg)?\b/y },
      { cls: 'attr', re: /[A-Za-z-]+(?=\s*:)/y },
    ];
  }
  if (['shell', 'bash', 'sh', 'zsh'].includes(l)) {
    return [
      { cls: 'com', re: /#.*/y },
      { cls: 'str', re: STRING_RE },
      {
        cls: 'kw',
        re: /\b(?:if|then|else|elif|fi|for|do|done|while|case|esac|in|function|return|export|echo|cd|ls|rm|mkdir|cat|grep|sed|awk|source|alias|local|unset|set)\b/y,
      },
      { cls: 'fn', re: /\$\{[^}]+\}|\$[A-Za-z_][\w]*/y },
      { cls: 'num', re: NUMBER_RE },
    ];
  }
  if (['python', 'py'].includes(l)) {
    return [
      { cls: 'com', re: /#.*/y },
      { cls: 'str', re: STRING_RE },
      {
        cls: 'kw',
        re: /\b(?:def|class|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|import|from|as|try|except|finally|raise|with|lambda|yield|pass|break|continue|async|await|global|nonlocal|assert)\b/y,
      },
      { cls: 'num', re: NUMBER_RE },
      { cls: 'fn', re: /\b[A-Za-z_][\w]*(?=\s*\()/y },
    ];
  }
  if (l === 'json') {
    return [
      { cls: 'str', re: STRING_RE },
      { cls: 'kw', re: /\b(?:true|false|null)\b/y },
      { cls: 'num', re: NUMBER_RE },
    ];
  }
  if (['yaml', 'yml', 'toml'].includes(l)) {
    return [
      { cls: 'com', re: /#.*/y },
      { cls: 'attr', re: /[A-Za-z_][\w-]*(?=\s*:)/y },
      { cls: 'str', re: STRING_RE },
      { cls: 'num', re: NUMBER_RE },
      { cls: 'kw', re: /\b(?:true|false|null|yes|no|on|off)\b/y },
    ];
  }
  if (['sql'].includes(l)) {
    return [
      { cls: 'com', re: /--.*/y },
      { cls: 'str', re: STRING_RE },
      {
        cls: 'kw',
        re: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|IS|IN|LIKE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|DISTINCT|COUNT|SUM|AVG|MIN|MAX|CASE|WHEN|THEN|ELSE|END|UNION|INDEX|PRIMARY|KEY|FOREIGN|REFERENCES)\b/yi,
      },
      { cls: 'num', re: NUMBER_RE },
    ];
  }
  // Generic fallback
  return [
    { cls: 'com', re: /\/\/.*/y },
    { cls: 'com', re: /#.*/y },
    { cls: 'str', re: STRING_RE },
    { cls: 'num', re: NUMBER_RE },
  ];
}

function highlightCodeLine(line: string, lang: string): string {
  if (!line) return '\u200b';
  const rules = rulesFor(lang || '');
  let out = '';
  let i = 0;
  while (i < line.length) {
    let matched = false;
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(line);
      if (m && m.index === i && m[0].length > 0) {
        out += `<span class="orot-md-tok-${rule.cls}">${esc(m[0])}</span>`;
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const ch = line[i];
      out += ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch;
      i++;
    }
  }
  return out;
}

// ── Block parser ──────────────────────────────────────

function renderTableRow(line: string, kind: 'header' | 'sep' | 'body'): string {
  // Split by | preserving leading/trailing syntax pipes
  const hasLeading = line.startsWith('|');
  const hasTrailing = line.endsWith('|') && line.length > 1;
  const inner = line.slice(hasLeading ? 1 : 0, hasTrailing ? line.length - 1 : line.length);
  const cells = inner.split('|');

  const parts: string[] = [];
  if (hasLeading) parts.push('<span class="orot-md-syntax">|</span>');
  cells.forEach((cell, idx) => {
    const content = kind === 'sep' ? `<span class="orot-md-syntax">${esc(cell)}</span>` : parseInline(cell);
    parts.push(`<span class="orot-md-td">${content}</span>`);
    if (idx < cells.length - 1) parts.push('<span class="orot-md-syntax">|</span>');
  });
  if (hasTrailing) parts.push('<span class="orot-md-syntax">|</span>');

  const kindClass =
    kind === 'header'
      ? 'orot-md-table-row--header'
      : kind === 'sep'
      ? 'orot-md-table-row--sep'
      : 'orot-md-table-row--body';
  return `<div class="orot-md-line orot-md-table-row ${kindClass}">${parts.join('')}</div>`;
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isTableRow(line: string): boolean {
  if (!/\|/.test(line)) return false;
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  // Skip other block constructs that may contain a pipe
  if (/^(#{1,6} |> |- |\* |\+ |\d+\. |```|---|___|\*\*\*)/.test(trimmed)) {
    return false;
  }
  return true;
}

function renderSingleMarkdownLine(
  line: string,
  options: MarkdownRenderOptions,
): string {
  const headingMatch = line.match(/^(#{1,6}) (.*)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const content = headingMatch[2];
    return `<div class="orot-md-line orot-md-h${level}"><span class="orot-md-syntax orot-md-heading-marker">${esc(headingMatch[1])} </span>${parseInline(content, options)}</div>`;
  }

  if (line.startsWith('> ') || line === '>') {
    const content = line.startsWith('> ') ? line.slice(2) : '';
    return `<div class="orot-md-line orot-md-blockquote"><span class="orot-md-syntax">&gt; </span>${parseInline(content, options)}</div>`;
  }

  const taskMatch = line.match(/^(\s*)-\s\[([ xX])\] (.*)$/);
  if (taskMatch) {
    const indent = taskMatch[1];
    const checked = taskMatch[2].toLowerCase() === 'x';
    const content = taskMatch[3];
    const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
    return `<div class="orot-md-line orot-md-task ${depthClass}${checked ? ' orot-md-task--done' : ''}"><span class="orot-md-syntax orot-md-task-prefix">${esc(indent)}- </span><span class="orot-md-task-toggle orot-md-syntax" role="checkbox" aria-checked="${checked}">[${esc(taskMatch[2])}]</span><span class="orot-md-syntax"> </span>${parseInline(content, options)}</div>`;
  }

  const ulMatch = line.match(/^(\s*)[-*+] (.*)$/);
  if (ulMatch) {
    const indent = ulMatch[1];
    const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
    return `<div class="orot-md-line orot-md-list ${depthClass}"><span class="orot-md-syntax">${esc(indent)}- </span>${parseInline(ulMatch[2], options)}</div>`;
  }

  const olMatch = line.match(/^(\s*)(\d+)\. (.*)$/);
  if (olMatch) {
    const indent = olMatch[1];
    const num = olMatch[2];
    return `<div class="orot-md-line orot-md-list-ordered"><span class="orot-md-syntax">${esc(indent)}${esc(num)}. </span>${parseInline(olMatch[3], options)}</div>`;
  }

  if (line.match(/^(---|\*\*\*|___)$/)) {
    return `<div class="orot-md-line orot-md-hr" aria-hidden="true"><span class="orot-md-syntax">${esc(line)}</span></div>`;
  }

  if (line === '') {
    return '<div class="orot-md-line"><br></div>';
  }

  return `<div class="orot-md-line">${parseInline(line, options)}</div>`;
}

function renderCodeBlock(
  lines: string[],
): string[] {
  const rendered: string[] = [];
  const startLine = lines[0];
  if (startLine === undefined) return rendered;

  const codeLang = startLine.slice(3).trim();
  const langAttr = codeLang ? ` data-lang="${escAttr(codeLang)}"` : '';
  rendered.push(
    `<div class="orot-md-line orot-md-code-fence-start"${langAttr}><span class="orot-md-code-line">${esc(startLine)}</span></div>`,
  );

  const hasClosingFence =
    lines.length > 1 && lines[lines.length - 1]?.startsWith('```');
  const codeLines = hasClosingFence ? lines.slice(1, -1) : lines.slice(1);

  codeLines.forEach((line, index) => {
    const firstClass = index === 0 ? ' orot-md-code-content--first' : '';
    const firstLangAttr = index === 0 && codeLang ? ` data-lang="${escAttr(codeLang)}"` : '';
    rendered.push(
      `<div class="orot-md-line orot-md-code-content${firstClass}"${firstLangAttr}><span class="orot-md-code-line">${highlightCodeLine(line, codeLang)}</span></div>`,
    );
  });

  if (hasClosingFence) {
    rendered.push(
      `<div class="orot-md-line orot-md-code-fence-end"><span class="orot-md-code-line">${esc(lines[lines.length - 1] ?? '')}</span></div>`,
    );
  }

  return rendered;
}

function renderTableBlock(
  lines: string[],
  options: MarkdownRenderOptions,
): string[] {
  if (lines.length < 2) {
    return lines.map((line) => renderSingleMarkdownLine(line, options));
  }

  const [header, separator, ...body] = lines;
  return [
    renderTableRow(header ?? '', 'header'),
    renderTableRow(separator ?? '', 'sep'),
    ...body.map((line) => renderTableRow(line, 'body')),
  ];
}

function getCacheKey(kind: string, lines: string[]): string | null {
  if (lines.some((line) => line.includes('!['))) {
    return null;
  }

  return `${kind}\u0000${lines.join('\n')}`;
}

function renderCachedBlock(
  kind: string,
  lines: string[],
  options: MarkdownRenderOptions,
  render: () => string[],
): string[] {
  const key = getCacheKey(kind, lines);
  if (key && options.cache) {
    const cached = options.cache.get(key);
    if (cached) {
      return cached.slice();
    }
  }

  const rendered = render();

  if (key && options.cache) {
    options.cache.set(key, rendered);
  }

  return rendered;
}

export function renderMarkdownLines(
  rawText: string,
  options: MarkdownRenderOptions = {},
): string[] {
  const lines = rawText.split('\n');
  const rendered: string[] = [];
  for (let idx = 0; idx < lines.length;) {
    const line = lines[idx] ?? '';

    if (line.startsWith('```')) {
      const start = idx;
      idx++;

      while (idx < lines.length && !(lines[idx] ?? '').startsWith('```')) {
        idx++;
      }

      if (idx < lines.length) {
        idx++;
      }

      const blockLines = lines.slice(start, idx);
      rendered.push(
        ...renderCachedBlock('code', blockLines, options, () =>
          renderCodeBlock(blockLines),
        ),
      );
      continue;
    }

    if (
      isTableRow(line) &&
      idx + 1 < lines.length &&
      isTableSeparator(lines[idx + 1] ?? '')
    ) {
      const start = idx;
      idx += 2;

      while (
        idx < lines.length &&
        isTableRow(lines[idx] ?? '') &&
        !isTableSeparator(lines[idx] ?? '')
      ) {
        idx++;
      }

      const blockLines = lines.slice(start, idx);
      rendered.push(
        ...renderCachedBlock('table', blockLines, options, () =>
          renderTableBlock(blockLines, options),
        ),
      );
      continue;
    }

    rendered.push(
      ...renderCachedBlock('line', [line], options, () => [
        renderSingleMarkdownLine(line, options),
      ]),
    );
    idx++;
  }

  return rendered;
}

export function renderMarkdown(
  rawText: string,
  options: MarkdownRenderOptions = {},
): string {
  return renderMarkdownLines(rawText, options).join('');
}
