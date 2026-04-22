import { Children, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import './Masonry.css';
import type { MasonryProps } from './Masonry.types';

function resolveColumns(
  columns: MasonryProps['columns'],
  width: number,
): number {
  if (typeof columns === 'number') return columns;
  if (!columns) return 3;
  if (width < 576 && columns.xs != null) return columns.xs;
  if (width < 768 && columns.sm != null) return columns.sm;
  if (width < 992 && columns.md != null) return columns.md;
  if (width < 1200 && columns.lg != null) return columns.lg;
  return columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.xs ?? 3;
}

export function Masonry({
  children,
  columns = 3,
  gap = 16,
  className = '',
  style,
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const items = Children.toArray(children);
  const [colCount, setColCount] = useState(() =>
    typeof columns === 'number' ? columns : 3,
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemHeights, setItemHeights] = useState<Array<number | null>>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const width = el.offsetWidth;
      setContainerWidth(width);
      setColCount(resolveColumns(columns, width));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [columns]);

  useEffect(() => {
    setItemHeights((prev) => items.map((_, index) => prev[index] ?? null));
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;

    const ro = new ResizeObserver((entries) => {
      setItemHeights((prev) => {
        const next = items.map((_, index) => prev[index] ?? null);
        let changed = false;

        for (const entry of entries) {
          const index = Number((entry.target as HTMLDivElement).dataset.index);
          if (!Number.isFinite(index)) continue;

          const height = Math.ceil(entry.contentRect.height);
          if (next[index] !== height) {
            next[index] = height;
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    });

    itemRefs.current.forEach((node, index) => {
      if (!node) return;
      node.dataset.index = String(index);
      ro.observe(node);
    });

    return () => ro.disconnect();
  }, [items.length, colCount, containerWidth]);

  const columnWidth = colCount > 0
    ? Math.max((containerWidth - gap * (colCount - 1)) / colCount, 0)
    : 0;

  const { positions, height } = useMemo(() => {
    const columnHeights = Array.from({ length: Math.max(colCount, 1) }, () => 0);

    const nextPositions = items.map((_, index) => {
      const columnIndex = columnHeights.reduce((shortest, current, currentIndex, all) => (
        current < all[shortest] ? currentIndex : shortest
      ), 0);

      const top = columnHeights[columnIndex];
      const left = columnIndex * (columnWidth + gap);
      const itemHeight = itemHeights[index] ?? 0;

      columnHeights[columnIndex] += itemHeight + gap;

      return { top, left };
    });

    const nextHeight = items.length > 0
      ? Math.max(...columnHeights) - gap
      : 0;

    return {
      positions: nextPositions,
      height: Math.max(nextHeight, 0),
    };
  }, [colCount, columnWidth, gap, itemHeights, items]);

  const isReady = columnWidth > 0 && items.every((_, index) => itemHeights[index] != null);

  const cls = ['orot-masonry', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={cls}
      style={{
        '--orot-masonry-gap': `${gap}px`,
        '--orot-masonry-height': `${height}px`,
        ...style,
      } as React.CSSProperties}
    >
      {items.map((item, index) => {
        const key = isValidElement(item) && item.key != null ? item.key : index;
        const position = positions[index] ?? { top: 0, left: 0 };

        return (
          <div
            key={key}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={`orot-masonry__item${isReady ? '' : ' orot-masonry__item--hidden'}`}
            style={{
              width: `${columnWidth}px`,
              transform: `translate(${position.left}px, ${position.top}px)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
