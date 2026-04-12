import type { ReactNode } from 'react';

export interface TreeSelectDataItem {
  value: string | number;
  title: ReactNode;
  children?: TreeSelectDataItem[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
}

export type TreeSelectStatus = 'error' | 'warning';
export type TreeSelectSize = 'sm' | 'md' | 'lg';

export interface TreeSelectProps {
  treeData?: TreeSelectDataItem[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  multiple?: boolean;
  treeCheckable?: boolean;
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  status?: TreeSelectStatus;
  size?: TreeSelectSize;
  showTreeLine?: boolean;
  notFoundContent?: ReactNode;
  treeDefaultExpandAll?: boolean;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
