import type { ReactNode } from 'react';

export interface TreeDataItem {
  key: string | number;
  title: ReactNode;
  children?: TreeDataItem[];
  disabled?: boolean;
  isLeaf?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TreeProps {
  treeData?: TreeDataItem[];
  checkedKeys?: (string | number)[];
  defaultCheckedKeys?: (string | number)[];
  selectedKeys?: (string | number)[];
  defaultSelectedKeys?: (string | number)[];
  expandedKeys?: (string | number)[];
  defaultExpandedKeys?: (string | number)[];
  defaultExpandAll?: boolean;
  checkable?: boolean;
  selectable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  showLine?: boolean | { showLeafIcon?: boolean };
  showIcon?: boolean;
  blockNode?: boolean;
  onCheck?: (checkedKeys: (string | number)[]) => void;
  onSelect?: (selectedKeys: (string | number)[], info: { node: TreeDataItem }) => void;
  onExpand?: (expandedKeys: (string | number)[], info: { node: TreeDataItem; expanded: boolean }) => void;
  className?: string;
  style?: React.CSSProperties;
}
