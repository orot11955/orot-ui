import { useState, type KeyboardEvent } from 'react';
import './Pagination.css';
import type { PaginationProps } from './Pagination.types';

function getPages(current: number, total: number): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 3) pages.push('ellipsis-start');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis-end');
  pages.push(total);
  return pages;
}

export function Pagination({
  current: controlledCurrent,
  defaultCurrent = 1,
  total,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal,
  simple = false,
  disabled = false,
  hideOnSinglePage = false,
  align,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  onShowSizeChange,
  className = '',
  style,
  ...rest
}: PaginationProps) {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [jumpValue, setJumpValue] = useState('');

  const current = controlledCurrent ?? internalCurrent;
  const pageSize = controlledPageSize ?? internalPageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const go = (page: number) => {
    const p = Math.max(1, Math.min(totalPages, page));
    if (p === current) return;
    if (controlledCurrent === undefined) setInternalCurrent(p);
    onChange?.(p, pageSize);
  };

  const changeSize = (size: number) => {
    if (controlledPageSize === undefined) setInternalPageSize(size);
    const newTotal = Math.max(1, Math.ceil(total / size));
    const newPage = Math.min(current, newTotal);
    if (controlledCurrent === undefined) setInternalCurrent(newPage);
    onShowSizeChange?.(newPage, size);
    onChange?.(newPage, size);
  };

  const handleJump = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(jumpValue, 10);
      if (!isNaN(page)) go(page);
      setJumpValue('');
    }
  };

  if (hideOnSinglePage && totalPages <= 1) return null;

  const cls = [
    'orot-pagination',
    simple && 'orot-pagination--simple',
    disabled && 'orot-pagination--disabled',
    align && `orot-pagination--${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const range: [number, number] = [
    (current - 1) * pageSize + 1,
    Math.min(current * pageSize, total),
  ];

  if (simple) {
    return (
      <nav className={cls} style={style} aria-label="pagination" {...rest}>
        <button
          className={`orot-pagination__item orot-pagination__prev${current <= 1 ? ' orot-pagination__item--disabled' : ''}`}
          onClick={() => go(current - 1)}
          disabled={current <= 1}
          aria-label="previous page"
        >
          ‹
        </button>
        <span className="orot-pagination__simple-page">
          <input
            className="orot-pagination__simple-input"
            value={jumpValue || current}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleJump}
            onFocus={(e) => e.target.select()}
            aria-label="current page"
          />
          / {totalPages}
        </span>
        <button
          className={`orot-pagination__item orot-pagination__next${current >= totalPages ? ' orot-pagination__item--disabled' : ''}`}
          onClick={() => go(current + 1)}
          disabled={current >= totalPages}
          aria-label="next page"
        >
          ›
        </button>
      </nav>
    );
  }

  return (
    <nav className={cls} style={style} aria-label="pagination" {...rest}>
      {showTotal && (
        <span className="orot-pagination__total">{showTotal(total, range)}</span>
      )}

      <button
        className={`orot-pagination__item orot-pagination__prev${current <= 1 ? ' orot-pagination__item--disabled' : ''}`}
        onClick={() => go(current - 1)}
        disabled={current <= 1}
        aria-label="previous page"
      >
        ‹
      </button>

      {getPages(current, totalPages).map((p, i) => {
        if (p === 'ellipsis-start' || p === 'ellipsis-end') {
          const jumpTo = p === 'ellipsis-start' ? current - 5 : current + 5;
          return (
            <span
              key={p}
              className="orot-pagination__ellipsis"
              onClick={() => go(jumpTo)}
              title={p === 'ellipsis-start' ? 'Previous 5 pages' : 'Next 5 pages'}
            >
              •••
            </span>
          );
        }
        return (
          <button
            key={`${p}-${i}`}
            className={`orot-pagination__item${p === current ? ' orot-pagination__item--active' : ''}`}
            onClick={() => go(p)}
            aria-current={p === current ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        className={`orot-pagination__item orot-pagination__next${current >= totalPages ? ' orot-pagination__item--disabled' : ''}`}
        onClick={() => go(current + 1)}
        disabled={current >= totalPages}
        aria-label="next page"
      >
        ›
      </button>

      {showSizeChanger && (
        <span className="orot-pagination__size-changer">
          <select
            className="orot-pagination__size-select"
            value={pageSize}
            onChange={(e) => changeSize(Number(e.target.value))}
            aria-label="page size"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
        </span>
      )}

      {showQuickJumper && (
        <span className="orot-pagination__jumper">
          Go to
          <input
            className="orot-pagination__jumper-input"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyDown={handleJump}
            aria-label="jump to page"
          />
        </span>
      )}
    </nav>
  );
}
