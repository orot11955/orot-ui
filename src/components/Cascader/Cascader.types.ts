import type { ReactNode } from 'react';

export interface CascaderOption {
  value: string | number;
  label: ReactNode;
  children?: CascaderOption[];
  disabled?: boolean;
  isLeaf?: boolean;
}

export type CascaderStatus = 'error' | 'warning';
export type CascaderSize = 'sm' | 'md' | 'lg';
export type CascaderExpandTrigger = 'click' | 'hover';

export interface CascaderProps {
  options?: CascaderOption[];
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
  status?: CascaderStatus;
  size?: CascaderSize;
  expandTrigger?: CascaderExpandTrigger;
  displayRender?: (labels: ReactNode[]) => ReactNode;
  notFoundContent?: ReactNode;
  changeOnSelect?: boolean;
  onChange?: (value: (string | number)[], selectedOptions: CascaderOption[]) => void;
  onSearch?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
