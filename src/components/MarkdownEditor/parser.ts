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

function isWordBoundary(ch: string | undefined): boolean {
  if (ch === undefined) return true;
  return !/[\p{L}\p{N}_]/u.test(ch);
}

export function parseInline(raw: string): string {
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

    // Italic: _text_ (not __) — require word boundary around it
    if (ch === '_' && raw[i + 1] !== '_' && isWordBoundary(raw[i - 1])) {
      const end = findSingleClose(raw, i + 1, '_');
      if (end !== -1 && isWordBoundary(raw[end + 1])) {
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
          result += `<span class="orot-md-image"><span class="orot-md-image-token orot-md-syntax">![${esc(alt)}](${esc(url)})</span><span class="orot-md-image-preview" contenteditable="false"><img src="${escAttr(url)}" alt="${escAttr(alt)}" class="orot-md-image-preview__img" loading="lazy" /></span></span>`;
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
          result += `<span class="orot-md-syntax">[</span><a href="${escAttr(url)}" class="orot-md-link" target="_blank" rel="noopener noreferrer">${parseInline(linkText)}</a><span class="orot-md-syntax">](${esc(url)})</span>`;
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

function renderTableRow(line: string, lineIdx: number, kind: 'header' | 'sep' | 'body'): string {
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
  return `<div class="orot-md-line orot-md-table-row ${kindClass}" data-line="${lineIdx}">${parts.join('')}</div>`;
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

export function renderMarkdown(rawText: string): string {
  const lines = rawText.split('\n');
  let inCodeBlock = false;
  let codeLang = '';
  let codeFirstLine = false;

  // Pre-scan table ranges: a header row followed by a separator makes a table.
  const tableKind: Array<'header' | 'sep' | 'body' | null> = new Array(lines.length).fill(null);
  for (let i = 0; i < lines.length; i++) {
    if (tableKind[i] !== null) continue;
    if (inCodeBlockAt(lines, i)) continue;
    if (isTableRow(lines[i]) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      tableKind[i] = 'header';
      tableKind[i + 1] = 'sep';
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j]) && !isTableSeparator(lines[j])) {
        tableKind[j] = 'body';
        j++;
      }
      i = j - 1;
    }
  }

  const rendered = lines.map((line, idx) => {
    // Table row
    const tk = tableKind[idx];
    if (tk) return renderTableRow(line, idx, tk);

    // Code fence toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        codeLang = '';
        codeFirstLine = false;
        return `<div class="orot-md-line orot-md-code-fence-end" data-line="${idx}"><span class="orot-md-code-line">${esc(line)}</span></div>`;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeFirstLine = true;
        const langAttr = codeLang ? ` data-lang="${escAttr(codeLang)}"` : '';
        return `<div class="orot-md-line orot-md-code-fence-start" data-line="${idx}"${langAttr}><span class="orot-md-code-line">${esc(line)}</span></div>`;
      }
    }

    // Inside code block
    if (inCodeBlock) {
      const firstClass = codeFirstLine ? ' orot-md-code-content--first' : '';
      const langAttr = codeFirstLine && codeLang ? ` data-lang="${escAttr(codeLang)}"` : '';
      codeFirstLine = false;
      const highlighted = highlightCodeLine(line, codeLang);
      return `<div class="orot-md-line orot-md-code-content${firstClass}" data-line="${idx}"${langAttr}><span class="orot-md-code-line">${highlighted}</span></div>`;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6}) (.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      return `<div class="orot-md-line orot-md-h${level}" data-line="${idx}"><span class="orot-md-syntax orot-md-heading-marker">${esc(headingMatch[1])} </span>${parseInline(content)}</div>`;
    }

    // Blockquote
    if (line.startsWith('> ') || line === '>') {
      const content = line.startsWith('> ') ? line.slice(2) : '';
      return `<div class="orot-md-line orot-md-blockquote" data-line="${idx}"><span class="orot-md-syntax">&gt; </span>${parseInline(content)}</div>`;
    }

    // Task list
    const taskMatch = line.match(/^(\s*)-\s\[([ xX])\] (.*)$/);
    if (taskMatch) {
      const indent = taskMatch[1];
      const checked = taskMatch[2].toLowerCase() === 'x';
      const content = taskMatch[3];
      const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
      return `<div class="orot-md-line orot-md-task ${depthClass}${checked ? ' orot-md-task--done' : ''}" data-line="${idx}"><span class="orot-md-syntax orot-md-task-prefix">${esc(indent)}- </span><span class="orot-md-task-toggle orot-md-syntax" role="checkbox" aria-checked="${checked}" data-task-toggle="${idx}">[${esc(taskMatch[2])}]</span><span class="orot-md-syntax"> </span>${parseInline(content)}</div>`;
    }

    // Unordered list
    const ulMatch = line.match(/^(\s*)[-*+] (.*)$/);
    if (ulMatch) {
      const indent = ulMatch[1];
      const depthClass = `orot-md-list--depth-${Math.min(Math.floor(indent.length / 2), 3)}`;
      return `<div class="orot-md-line orot-md-list ${depthClass}" data-line="${idx}"><span class="orot-md-syntax">${esc(indent)}- </span>${parseInline(ulMatch[2])}</div>`;
    }

    // Ordered list
    const olMatch = line.match(/^(\s*)(\d+)\. (.*)$/);
    if (olMatch) {
      const indent = olMatch[1];
      const num = olMatch[2];
      return `<div class="orot-md-line orot-md-list-ordered" data-line="${idx}"><span class="orot-md-syntax">${esc(indent)}${esc(num)}. </span>${parseInline(olMatch[3])}</div>`;
    }

    // Horizontal rule
    if (line.match(/^(---|\*\*\*|___)$/)) {
      return `<div class="orot-md-line orot-md-hr" data-line="${idx}" aria-hidden="true"><span class="orot-md-syntax">${esc(line)}</span></div>`;
    }

    // Empty line
    if (line === '') {
      return `<div class="orot-md-line" data-line="${idx}"><br></div>`;
    }

    // Regular paragraph
    return `<div class="orot-md-line" data-line="${idx}">${parseInline(line)}</div>`;
  });

  return rendered.join('');
}

// Helper: quickly tell whether line `i` is within a code fence given the raw lines.
// Used during table pre-scan so we don't accidentally style fenced pipes.
function inCodeBlockAt(lines: string[], i: number): boolean {
  let inside = false;
  for (let k = 0; k < i; k++) {
    if (lines[k].startsWith('```')) inside = !inside;
  }
  return inside;
}
