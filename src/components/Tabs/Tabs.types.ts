import type { HTMLAttributes, ReactNode } from 'react';

export type TabsType = 'line' | 'card';
export type TabPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TabItem {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  type?: TabsType;
  /** 탭 위치. tabPlacement와 동일 */
  tabPosition?: TabPosition;
  /** tabPosition의 alias (현재 API 감각) */
  tabPlacement?: TabPosition;
  centered?: boolean;
  destroyOnHidden?: boolean;
  onChange?: (key: string) => void;
}
