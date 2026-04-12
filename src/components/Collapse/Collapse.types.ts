import type { HTMLAttributes, ReactNode } from 'react';

export interface CollapseItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  collapsible?: 'header' | 'disabled';
}

export type ExpandIconPosition = 'start' | 'end';
export type CollapseSize = 'sm' | 'md' | 'lg';

export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: CollapseItem[];
  activeKey?: string | string[];
  defaultActiveKey?: string | string[];
  accordion?: boolean;
  bordered?: boolean;
  ghost?: boolean;
  size?: CollapseSize;
  collapsible?: 'header' | 'disabled';
  destroyOnHidden?: boolean;
  expandIconPosition?: ExpandIconPosition;
  onChange?: (keys: string[]) => void;
}
