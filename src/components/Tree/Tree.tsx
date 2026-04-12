import { useState } from 'react';
import './Tree.css';
import type { TreeDataItem, TreeProps } from './Tree.types';

function getAllKeys(items: TreeDataItem[]): (string | number)[] {
  const keys: (string | number)[] = [];
  function collect(list: TreeDataItem[]) {
    for (const item of list) {
      keys.push(item.key);
      if (item.children) collect(item.children);
    }
  }
  collect(items);
  return keys;
}

interface TreeNodeProps {
  node: TreeDataItem;
  depth: number;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  indeterminate: boolean;
  checkable: boolean;
  selectable: boolean;
  disabled: boolean;
  showLine: boolean;
  showIcon: boolean;
  blockNode: boolean;
  onToggleExpand: (key: string | number) => void;
  onSelect: (node: TreeDataItem) => void;
  onCheck: (key: string | number, checked: boolean) => void;
  children: React.ReactNode;
}

function TreeNode({
  node,
  depth,
  expanded,
  selected,
  checked,
  indeterminate,
  checkable,
  selectable,
  disabled,
  showLine,
  showIcon,
  blockNode,
  onToggleExpand,
  onSelect,
  onCheck,
  children,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isDisabled = disabled || node.disabled;

  return (
    <li className={['orot-tree__node', showLine && 'orot-tree__node--line', node.className].filter(Boolean).join(' ')} style={node.style}>
      <div
        className={[
          'orot-tree__node-content',
          selected && 'orot-tree__node-content--selected',
          isDisabled && 'orot-tree__node-content--disabled',
          blockNode && 'orot-tree__node-content--block',
        ].filter(Boolean).join(' ')}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <span
          className={['orot-tree__switcher', hasChildren ? (expanded ? 'orot-tree__switcher--open' : 'orot-tree__switcher--close') : 'orot-tree__switcher--leaf'].filter(Boolean).join(' ')}
          onClick={() => hasChildren && !isDisabled && onToggleExpand(node.key)}
        >
          {hasChildren ? (expanded ? '▾' : '▸') : null}
        </span>

        {checkable && node.checkable !== false && (
          <input
            type="checkbox"
            className="orot-tree__checkbox"
            checked={checked}
            disabled={isDisabled}
            ref={(el) => { if (el) el.indeterminate = indeterminate; }}
            onChange={(e) => !isDisabled && onCheck(node.key, e.target.checked)}
          />
        )}

        {showIcon && node.icon && (
          <span className="orot-tree__icon">{node.icon}</span>
        )}

        <span
          className="orot-tree__title"
          onClick={() => selectable && node.selectable !== false && !isDisabled && onSelect(node)}
        >
          {node.title}
        </span>
      </div>

      {hasChildren && expanded && (
        <ul className="orot-tree__children">{children}</ul>
      )}
    </li>
  );
}

export function Tree({
  treeData = [],
  checkedKeys: controlledChecked,
  defaultCheckedKeys = [],
  selectedKeys: controlledSelected,
  defaultSelectedKeys = [],
  expandedKeys: controlledExpanded,
  defaultExpandedKeys = [],
  defaultExpandAll = false,
  checkable = false,
  selectable = true,
  multiple = false,
  disabled = false,
  showLine = false,
  showIcon = false,
  blockNode = false,
  onCheck,
  onSelect,
  onExpand,
  className = '',
  style,
}: TreeProps) {
  const allKeys = getAllKeys(treeData);

  const [internalExpanded, setInternalExpanded] = useState<(string | number)[]>(
    defaultExpandAll ? allKeys : defaultExpandedKeys,
  );
  const [internalSelected, setInternalSelected] = useState<(string | number)[]>(defaultSelectedKeys);
  const [internalChecked, setInternalChecked] = useState<(string | number)[]>(defaultCheckedKeys);

  const expanded = controlledExpanded ?? internalExpanded;
  const selected = controlledSelected ?? internalSelected;
  const checked = controlledChecked ?? internalChecked;

  const handleToggleExpand = (key: string | number) => {
    const next = expanded.includes(key) ? expanded.filter(k => k !== key) : [...expanded, key];
    if (controlledExpanded === undefined) setInternalExpanded(next);
    const node = allKeys.includes(key) ? findNode(treeData, key) : null;
    if (node) onExpand?.(next, { node, expanded: !expanded.includes(key) });
  };

  const handleSelect = (node: TreeDataItem) => {
    let next: (string | number)[];
    if (multiple) {
      next = selected.includes(node.key) ? selected.filter(k => k !== node.key) : [...selected, node.key];
    } else {
      next = selected.includes(node.key) ? [] : [node.key];
    }
    if (controlledSelected === undefined) setInternalSelected(next);
    onSelect?.(next, { node });
  };

  const getDescendantKeys = (node: TreeDataItem): (string | number)[] => {
    const keys: (string | number)[] = [node.key];
    if (node.children) node.children.forEach(c => keys.push(...getDescendantKeys(c)));
    return keys;
  };

  const handleCheck = (key: string | number, isChecked: boolean) => {
    const node = findNode(treeData, key);
    const affected = node ? getDescendantKeys(node) : [key];
    const next = isChecked
      ? [...new Set([...checked, ...affected])]
      : checked.filter(k => !affected.includes(k));
    if (controlledChecked === undefined) setInternalChecked(next);
    onCheck?.(next);
  };

  const findNode = (items: TreeDataItem[], key: string | number): TreeDataItem | null => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) { const found = findNode(item.children, key); if (found) return found; }
    }
    return null;
  };

  const getIndeterminate = (node: TreeDataItem): boolean => {
    if (!node.children) return false;
    const desc = getDescendantKeys(node).filter(k => k !== node.key);
    const checkedCount = desc.filter(k => checked.includes(k)).length;
    return checkedCount > 0 && checkedCount < desc.length;
  };

  const renderNodes = (items: TreeDataItem[], depth = 0): React.ReactNode => {
    return items.map(node => (
      <TreeNode
        key={node.key}
        node={node}
        depth={depth}
        expanded={expanded.includes(node.key)}
        selected={selected.includes(node.key)}
        checked={checked.includes(node.key)}
        indeterminate={getIndeterminate(node)}
        checkable={checkable}
        selectable={selectable}
        disabled={disabled}
        showLine={showLine !== false}
        showIcon={showIcon}
        blockNode={blockNode}
        onToggleExpand={handleToggleExpand}
        onSelect={handleSelect}
        onCheck={handleCheck}
      >
        {node.children ? renderNodes(node.children, depth + 1) : null}
      </TreeNode>
    ));
  };

  return (
    <ul
      className={[
        'orot-tree',
        showLine && 'orot-tree--line',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      role="tree"
    >
      {renderNodes(treeData)}
    </ul>
  );
}
