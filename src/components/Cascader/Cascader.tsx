import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Cascader.css';
import type { CascaderOption, CascaderProps } from './Cascader.types';

function findPath(options: CascaderOption[], values: (string | number)[]): CascaderOption[] {
  const path: CascaderOption[] = [];
  let current = options;
  for (const val of values) {
    const found = current.find(o => o.value === val);
    if (!found) break;
    path.push(found);
    current = found.children ?? [];
  }
  return path;
}

export function Cascader({
  options = [],
  value: controlledValue,
  defaultValue = [],
  placeholder = 'Select...',
  disabled = false,
  allowClear = false,
  showSearch = false,
  status,
  size = 'md',
  expandTrigger = 'click',
  displayRender,
  notFoundContent = 'No data',
  changeOnSelect = false,
  onChange,
  onSearch,
  className = '',
  style,
}: CascaderProps) {
  const [internalValue, setInternalValue] = useState<(string | number)[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState<(string | number)[]>([]);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const value = controlledValue ?? internalValue;

  const updatePos = () => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setPos(null);
        setActivePath([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const commit = (nextValue: (string | number)[], path: CascaderOption[]) => {
    if (controlledValue === undefined) setInternalValue(nextValue);
    onChange?.(nextValue, path);
  };

  const handleOptionClick = (option: CascaderOption, depth: number) => {
    if (option.disabled) return;
    const nextPath = [...activePath.slice(0, depth), option.value];
    setActivePath(nextPath);

    const isLeaf = !option.children || option.children.length === 0 || option.isLeaf;
    if (isLeaf || changeOnSelect) {
      const selectedPath = findPath(options, nextPath);
      commit(nextPath, selectedPath);
      if (isLeaf) { setOpen(false); setActivePath([]); }
    }
  };

  const handleOptionHover = (option: CascaderOption, depth: number) => {
    if (expandTrigger !== 'hover' || option.disabled) return;
    const nextPath = [...activePath.slice(0, depth), option.value];
    setActivePath(nextPath);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) setInternalValue([]);
    onChange?.([], []);
  };

  const selectedPath = findPath(options, value);
  const labels = selectedPath.map(o => o.label);
  const displayText = displayRender ? displayRender(labels) : labels.map(l => String(l)).join(' / ');

  // Build columns to show based on activePath
  const columns: CascaderOption[][] = [options];
  for (let i = 0; i < activePath.length; i++) {
    const activeOption = columns[i]?.find(o => o.value === activePath[i]);
    if (activeOption?.children) columns.push(activeOption.children);
  }

  return (
    <div
      ref={containerRef}
      className={[
        'orot-cascader',
        `orot-cascader--${size}`,
        status && `orot-cascader--${status}`,
        disabled && 'orot-cascader--disabled',
        open && 'orot-cascader--open',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div
        className="orot-cascader__selector"
        onClick={() => !disabled && setOpen(!open)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
      >
        {showSearch && open ? (
          <input
            autoFocus
            className="orot-cascader__search-input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); onSearch?.(e.target.value); }}
            onClick={(e) => e.stopPropagation()}
            placeholder={placeholder}
          />
        ) : (
          <span className={value.length > 0 ? 'orot-cascader__value' : 'orot-cascader__placeholder'}>
            {value.length > 0 ? displayText : placeholder}
          </span>
        )}
        <span className="orot-cascader__icons">
          {allowClear && value.length > 0 && !disabled && (
            <button type="button" className="orot-cascader__clear" onClick={handleClear} tabIndex={-1}>✕</button>
          )}
          <span className="orot-cascader__arrow">▾</span>
        </span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
        <div
          ref={dropdownRef}
          className="orot-cascader__dropdown"
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
        >
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="orot-cascader__column">
              {col.length === 0
                ? <div className="orot-cascader__empty">{notFoundContent}</div>
                : col.map(option => {
                  const isActive = activePath[colIdx] === option.value || value[colIdx] === option.value;
                  const hasChildren = option.children && option.children.length > 0;
                  return (
                    <div
                      key={option.value}
                      className={[
                        'orot-cascader__option',
                        isActive && 'orot-cascader__option--active',
                        option.disabled && 'orot-cascader__option--disabled',
                      ].filter(Boolean).join(' ')}
                      onClick={() => handleOptionClick(option, colIdx)}
                      onMouseEnter={() => handleOptionHover(option, colIdx)}
                    >
                      <span className="orot-cascader__option-label">{option.label}</span>
                      {hasChildren && <span className="orot-cascader__expand-icon">›</span>}
                    </div>
                  );
                })
              }
            </div>
          ))}
        </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}
