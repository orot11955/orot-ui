import { useState } from 'react';
import './Transfer.css';
import type { TransferItem, TransferProps } from './Transfer.types';

interface PanelProps {
  title: React.ReactNode;
  items: TransferItem[];
  selectedKeys: string[];
  disabled: boolean;
  showSearch: boolean;
  showSelectAll: boolean;
  render?: (item: TransferItem) => React.ReactNode;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  onItemSelect: (key: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSearch?: (value: string) => void;
  direction: 'left' | 'right';
  listStyle?: React.CSSProperties;
}

function TransferPanel({
  title,
  items,
  selectedKeys,
  disabled,
  showSearch,
  showSelectAll,
  render,
  filterOption,
  onItemSelect,
  onSelectAll,
  onSearch,
  listStyle,
}: PanelProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? items.filter(item => filterOption ? filterOption(search, item) : item.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  const checkedAll = filtered.length > 0 && filtered.every(i => selectedKeys.includes(i.key));
  const indeterminate = filtered.some(i => selectedKeys.includes(i.key)) && !checkedAll;

  return (
    <div className="orot-transfer__panel" style={listStyle}>
      <div className="orot-transfer__panel-header">
        {showSelectAll && (
          <input
            type="checkbox"
            checked={checkedAll}
            disabled={disabled || filtered.length === 0}
            ref={el => { if (el) el.indeterminate = indeterminate; }}
            onChange={e => onSelectAll(e.target.checked)}
          />
        )}
        <span className="orot-transfer__panel-title">{title}</span>
        <span className="orot-transfer__panel-count">{selectedKeys.filter(k => items.some(i => i.key === k)).length}/{items.length}</span>
      </div>

      {showSearch && (
        <div className="orot-transfer__panel-search">
          <input
            className="orot-transfer__search"
            value={search}
            onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value); }}
            placeholder="Search..."
          />
        </div>
      )}

      <ul className="orot-transfer__panel-list">
        {filtered.map(item => (
          <li
            key={item.key}
            className={[
              'orot-transfer__item',
              selectedKeys.includes(item.key) && 'orot-transfer__item--selected',
              (disabled || item.disabled) && 'orot-transfer__item--disabled',
            ].filter(Boolean).join(' ')}
          >
            <input
              type="checkbox"
              checked={selectedKeys.includes(item.key)}
              disabled={disabled || item.disabled}
              onChange={e => onItemSelect(item.key, e.target.checked)}
            />
            <span className="orot-transfer__item-content">
              {render ? render(item) : item.title}
            </span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="orot-transfer__empty">No data</li>
        )}
      </ul>
    </div>
  );
}

export function Transfer({
  dataSource = [],
  targetKeys: controlledTarget,
  defaultTargetKeys = [],
  selectedKeys: controlledSelected,
  defaultSelectedKeys = [],
  disabled = false,
  showSearch = false,
  showSelectAll = true,
  titles = ['Source', 'Target'],
  operations = ['→', '←'],
  filterOption,
  render,
  listStyle,
  onChange,
  onSelectChange,
  onSearch,
  className = '',
  style,
}: TransferProps) {
  const [internalTarget, setInternalTarget] = useState<string[]>(defaultTargetKeys);
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelectedKeys);

  const targetKeys = controlledTarget ?? internalTarget;
  const selectedKeys = controlledSelected ?? internalSelected;

  const sourceItems = dataSource.filter(i => !targetKeys.includes(i.key));
  const targetItems = dataSource.filter(i => targetKeys.includes(i.key));

  const sourceSelected = selectedKeys.filter(k => sourceItems.some(i => i.key === k));
  const targetSelected = selectedKeys.filter(k => targetItems.some(i => i.key === k));

  const commitSelected = (next: string[]) => {
    if (controlledSelected === undefined) setInternalSelected(next);
    onSelectChange?.(next.filter(k => sourceItems.some(i => i.key === k)), next.filter(k => targetItems.some(i => i.key === k)));
  };

  const handleItemSelect = (key: string, checked: boolean) => {
    const next = checked ? [...selectedKeys, key] : selectedKeys.filter(k => k !== key);
    commitSelected(next);
  };

  const handleSelectAll = (direction: 'left' | 'right', checked: boolean) => {
    const items = direction === 'left' ? sourceItems : targetItems;
    const panelKeys = items.map(i => i.key);
    const next = checked
      ? [...new Set([...selectedKeys, ...panelKeys])]
      : selectedKeys.filter(k => !panelKeys.includes(k));
    commitSelected(next);
  };

  const moveTo = (direction: 'right' | 'left') => {
    const moveKeys = direction === 'right' ? sourceSelected : targetSelected;
    if (moveKeys.length === 0) return;
    const nextTarget = direction === 'right'
      ? [...targetKeys, ...moveKeys]
      : targetKeys.filter(k => !moveKeys.includes(k));
    if (controlledTarget === undefined) setInternalTarget(nextTarget);
    commitSelected(selectedKeys.filter(k => !moveKeys.includes(k)));
    onChange?.(nextTarget, direction, moveKeys);
  };

  const getListStyle = (dir: 'left' | 'right'): React.CSSProperties | undefined => {
    if (typeof listStyle === 'function') return listStyle({ direction: dir });
    return listStyle;
  };

  return (
    <div className={['orot-transfer', className].filter(Boolean).join(' ')} style={style}>
      <TransferPanel
        title={titles[0]}
        items={sourceItems}
        selectedKeys={sourceSelected}
        disabled={disabled}
        showSearch={showSearch}
        showSelectAll={showSelectAll}
        render={render}
        filterOption={filterOption}
        onItemSelect={handleItemSelect}
        onSelectAll={(checked) => handleSelectAll('left', checked)}
        onSearch={(v) => onSearch?.('left', v)}
        direction="left"
        listStyle={getListStyle('left')}
      />

      <div className="orot-transfer__operations">
        <button
          type="button"
          className="orot-transfer__op-btn"
          disabled={disabled || sourceSelected.length === 0}
          onClick={() => moveTo('right')}
        >
          {operations[0]}
        </button>
        <button
          type="button"
          className="orot-transfer__op-btn"
          disabled={disabled || targetSelected.length === 0}
          onClick={() => moveTo('left')}
        >
          {operations[1]}
        </button>
      </div>

      <TransferPanel
        title={titles[1]}
        items={targetItems}
        selectedKeys={targetSelected}
        disabled={disabled}
        showSearch={showSearch}
        showSelectAll={showSelectAll}
        render={render}
        filterOption={filterOption}
        onItemSelect={handleItemSelect}
        onSelectAll={(checked) => handleSelectAll('right', checked)}
        onSearch={(v) => onSearch?.('right', v)}
        direction="right"
        listStyle={getListStyle('right')}
      />
    </div>
  );
}
