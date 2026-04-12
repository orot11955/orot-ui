import type { ReactNode } from 'react';

export interface TransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface TransferProps {
  dataSource?: TransferItem[];
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  disabled?: boolean;
  showSearch?: boolean;
  showSelectAll?: boolean;
  titles?: [ReactNode, ReactNode];
  operations?: [ReactNode, ReactNode];
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  render?: (item: TransferItem) => ReactNode;
  listStyle?: React.CSSProperties | ((props: { direction: 'left' | 'right' }) => React.CSSProperties);
  onChange?: (targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void;
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  onSearch?: (direction: 'left' | 'right', value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}
