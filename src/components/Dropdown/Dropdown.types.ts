import type { HTMLAttributes, ReactNode } from 'react';

export type DropdownTrigger = 'hover' | 'click' | 'contextMenu';
export type DropdownPlacement =
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'top' | 'topLeft' | 'topRight';

export interface DropdownItemType {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: 'divider';
  children?: DropdownItemType[];
  onClick?: (key: string) => void;
}

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items?: DropdownItemType[];
  menu?: {
    items: DropdownItemType[];
  };
  trigger?: DropdownTrigger | DropdownTrigger[];
  placement?: DropdownPlacement;
  open?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  popupRender?: (menu: ReactNode) => ReactNode;
  destroyOnHidden?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}
