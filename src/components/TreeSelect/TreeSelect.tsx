import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TreeSelect.css';
import type { TreeSelectDataItem, TreeSelectProps } from './TreeSelect.types';

function flattenTree(items: TreeSelectDataItem[]): TreeSelectDataItem[] {
  const result: TreeSelectDataItem[] = [];
  function walk(list: TreeSelectDataItem[]) {
    for (const item of list) {
      result.push(item);
      if (item.children) walk(item.children);
    }
  }
  walk(items);
  return result;
}

function getAllKeys(items: TreeSelectDataItem[]): (string | number)[] {
  return flattenTree(items).map(i => i.value);
}

function findItem(items: TreeSelectDataItem[], value: string | number): TreeSelectDataItem | undefined {
  return flattenTree(items).find(i => i.value === value);
}

function TreeNode({
  item,
  depth,
  expandedKeys,
  selectedValues,
  checkedValues,
  checkable,
  filterText,
  onToggle,
  onSelect,
  onCheck,
}: {
  item: TreeSelectDataItem;
  depth: number;
  expandedKeys: (string | number)[];
  selectedValues: (string | number)[];
  checkedValues: (string | number)[];
  checkable: boolean;
  filterText: string;
  onToggle: (key: string | number) => void;
  onSelect: (item: TreeSelectDataItem) => void;
  onCheck: (key: string | number, checked: boolean) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedKeys.includes(item.value);
  const isSelected = selectedValues.includes(item.value);
  const isChecked = checkedValues.includes(item.value);
  const title = typeof item.title === 'string' ? item.title : '';
  const matchesFilter = !filterText || title.toLowerCase().includes(filterText.toLowerCase());

  if (!matchesFilter && !hasChildren) return null;

  return (
    <li className="orot-treeselect__node">
      <div
        className={[
          'orot-treeselect__node-content',
          isSelected && 'orot-treeselect__node-content--selected',
          item.disabled && 'orot-treeselect__node-content--disabled',
        ].filter(Boolean).join(' ')}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span
          className="orot-treeselect__switcher"
          onClick={() => hasChildren && onToggle(item.value)}
        >
          {hasChildren ? (isExpanded ? '▾' : '▸') : null}
        </span>

        {checkable && (
          <input
            type="checkbox"
            checked={isChecked}
            disabled={item.disabled}
            onChange={(e) => onCheck(item.value, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        <span
          className="orot-treeselect__title"
          onClick={() => !item.disabled && item.selectable !== false && onSelect(item)}
        >
          {item.title}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <ul className="orot-treeselect__children">
          {item.children!.map(child => (
            <TreeNode
              key={child.value}
              item={child}
              depth={depth + 1}
              expandedKeys={expandedKeys}
              selectedValues={selectedValues}
              checkedValues={checkedValues}
              checkable={checkable}
              filterText={filterText}
              onToggle={onToggle}
              onSelect={onSelect}
              onCheck={onCheck}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeSelect({
  treeData = [],
  value: controlledValue,
  defaultValue,
  multiple = false,
  treeCheckable = false,
  showSearch = false,
  allowClear = false,
  disabled = false,
  placeholder = 'Select...',
  status,
  size = 'md',
  notFoundContent = 'No data',
  treeDefaultExpandAll = false,
  onChange,
  onSearch,
  className = '',
  style,
}: TreeSelectProps) {
  const normalize = (v: typeof defaultValue): (string | number)[] => {
    if (v === undefined || v === null) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [internalValue, setInternalValue] = useState<(string | number)[]>(normalize(defaultValue));
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(
    treeDefaultExpandAll ? getAllKeys(treeData) : [],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedArr = controlledValue !== undefined ? normalize(controlledValue) : internalValue;

  const commit = (next: (string | number)[]) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(multiple || treeCheckable ? next : next[0]);
  };

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
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (item: TreeSelectDataItem) => {
    if (multiple) {
      const next = selectedArr.includes(item.value)
        ? selectedArr.filter(v => v !== item.value)
        : [...selectedArr, item.value];
      commit(next);
    } else {
      commit([item.value]);
      setOpen(false);
    }
  };

  const handleCheck = (key: string | number, checked: boolean) => {
    const next = checked ? [...selectedArr, key] : selectedArr.filter(v => v !== key);
    commit(next);
  };

  const handleToggleExpand = (key: string | number) => {
    setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    commit([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  const getLabel = (v: string | number) => {
    const item = findItem(treeData, v);
    return item ? item.title : String(v);
  };

  return (
    <div
      ref={containerRef}
      className={[
        'orot-treeselect',
        `orot-treeselect--${size}`,
        status && `orot-treeselect--${status}`,
        disabled && 'orot-treeselect--disabled',
        open && 'orot-treeselect--open',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div
        className="orot-treeselect__selector"
        onClick={() => !disabled && setOpen(!open)}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="orot-treeselect__selection">
          {selectedArr.length === 0 ? (
            <span className="orot-treeselect__placeholder">{placeholder}</span>
          ) : multiple || treeCheckable ? (
            selectedArr.map(v => (
              <span key={v} className="orot-treeselect__tag">
                {getLabel(v)}
                <button
                  type="button"
                  className="orot-treeselect__tag-remove"
                  onClick={(e) => { e.stopPropagation(); commit(selectedArr.filter(x => x !== v)); }}
                  tabIndex={-1}
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="orot-treeselect__value">{getLabel(selectedArr[0])}</span>
          )}
        </div>
        <span className="orot-treeselect__icons">
          {allowClear && selectedArr.length > 0 && !disabled && (
            <button type="button" className="orot-treeselect__clear" onClick={handleClear} tabIndex={-1}>✕</button>
          )}
          <span className="orot-treeselect__arrow">▾</span>
        </span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
        <div
          ref={dropdownRef}
          className="orot-treeselect__dropdown"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
        >
          {showSearch && (
            <div className="orot-treeselect__search-wrap">
              <input
                autoFocus
                className="orot-treeselect__search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search..."
              />
            </div>
          )}
          <ul className="orot-treeselect__tree">
            {treeData.length === 0
              ? <li className="orot-treeselect__empty">{notFoundContent}</li>
              : treeData.map(item => (
                <TreeNode
                  key={item.value}
                  item={item}
                  depth={0}
                  expandedKeys={expandedKeys}
                  selectedValues={selectedArr}
                  checkedValues={treeCheckable ? selectedArr : []}
                  checkable={treeCheckable}
                  filterText={search}
                  onToggle={handleToggleExpand}
                  onSelect={handleSelect}
                  onCheck={handleCheck}
                />
              ))
            }
          </ul>
        </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}
