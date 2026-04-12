import type { HTMLAttributes, ReactNode } from 'react';

export type MenuMode = 'vertical' | 'horizontal' | 'inline';

export interface MenuItemType {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  children?: MenuItemType[];
  disabled?: boolean;
  type?: 'divider' | 'group';
}

export interface MenuClickInfo {
  key: string;
  keyPath: string[];
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onClick' | 'onSelect'> {
  items: MenuItemType[];
  mode?: MenuMode;
  theme?: 'light' | 'dark';
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  openKeys?: string[];
  defaultOpenKeys?: string[];
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  selectable?: boolean;
  multiple?: boolean;
  onClick?: (info: MenuClickInfo) => void;
  onSelect?: (info: MenuClickInfo) => void;
  onDeselect?: (info: MenuClickInfo) => void;
  onOpenChange?: (keys: string[]) => void;
}
