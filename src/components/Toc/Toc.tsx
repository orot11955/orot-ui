import { useEffect, useRef, useState } from 'react';
import './Toc.css';
import type { TocItem, TocProps } from './Toc.types';

/**
 * Parse markdown text and extract headings as a flat list.
 */
function parseMarkdown(markdown: string, maxDepth: number): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  const slugCounts: Record<string, number> = {};

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    if (level > maxDepth) continue;

    const rawText = match[2].replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').trim();
    const baseSlug = rawText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    slugCounts[baseSlug] = (slugCounts[baseSlug] ?? 0) + 1;
    const id = slugCounts[baseSlug] > 1 ? `${baseSlug}-${slugCounts[baseSlug] - 1}` : baseSlug;

    items.push({ id, text: rawText, level });
  }

  return items;
}

/**
 * Build a nested tree from a flat list of TocItems.
 * Items are nested when a higher-level heading contains lower-level ones.
 */
function buildTree(items: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of items) {
    const node: TocItem = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children ?? [];
      parent.children.push(node);
    }

    stack.push(node);
  }

  return root;
}

interface TocListProps {
  items: TocItem[];
  activeId: string | undefined;
  onClick: (id: string) => void;
  indent: boolean;
  nested?: boolean;
}

function TocList({ items, activeId, onClick, indent, nested = false }: TocListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={`orot-toc__list${nested ? ' orot-toc__list--nested' : ''}`}>
      {items.map((item) => (
        <li key={item.id} className="orot-toc__item">
          <a
            href={`#${item.id}`}
            className={[
              'orot-toc__link',
              `orot-toc__link--level-${item.level}`,
              activeId === item.id && 'orot-toc__link--active',
            ].filter(Boolean).join(' ')}
            onClick={(e) => {
              e.preventDefault();
              onClick(item.id);
            }}
            title={item.text}
          >
            {item.text}
          </a>
          {indent && item.children && item.children.length > 0 && (
            <TocList
              items={item.children}
              activeId={activeId}
              onClick={onClick}
              indent={indent}
              nested
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function Toc({
  markdown,
  items: itemsProp,
  activeId: controlledActiveId,
  maxDepth = 3,
  title = 'On this page',
  indent = true,
  onClick,
  smooth = true,
  observe = false,
  className = '',
  style,
}: TocProps) {
  const [observedActiveId, setObservedActiveId] = useState<string | undefined>(undefined);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const flatItems: TocItem[] = itemsProp
    ? itemsProp
    : markdown
      ? parseMarkdown(markdown, maxDepth)
      : [];

  const treeItems = buildTree(flatItems);

  const activeId = controlledActiveId ?? (observe ? observedActiveId : undefined);

  useEffect(() => {
    if (!observe || flatItems.length === 0) return undefined;

    const headingEls: Element[] = [];
    for (const item of flatItems) {
      const el = document.getElementById(item.id);
      if (el) headingEls.push(el);
    }

    if (headingEls.length === 0) return undefined;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setObservedActiveId((topmost.target as HTMLElement).id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    for (const el of headingEls) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [observe, flatItems.map((i) => i.id).join(',')]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
    onClick?.(id);
  };

  if (treeItems.length === 0) return null;

  return (
    <nav
      className={['orot-toc', className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Table of contents"
    >
      {title && <div className="orot-toc__title">{title}</div>}
      <TocList
        items={treeItems}
        activeId={activeId}
        onClick={handleClick}
        indent={indent}
      />
    </nav>
  );
}
