import { Children, useEffect, useRef, useState } from 'react';
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
  const [colCount, setColCount] = useState(() =>
    typeof columns === 'number' ? columns : 3,
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setColCount(resolveColumns(columns, el.offsetWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [columns]);

  const items = Children.toArray(children);
  const cols: React.ReactNode[][] = Array.from({ length: colCount }, () => []);
  items.forEach((child, i) => cols[i % colCount].push(child));

  const cls = ['orot-masonry', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={cls}
      style={{ '--orot-masonry-gap': `${gap}px`, ...style } as React.CSSProperties}
    >
      {cols.map((col, ci) => (
        <div key={ci} className="orot-masonry__col">
          {col.map((item, ii) => (
            <div key={ii} className="orot-masonry__item">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
