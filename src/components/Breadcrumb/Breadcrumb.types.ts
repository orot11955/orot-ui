import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { DropdownItemType } from '../Dropdown/Dropdown.types';

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  menu?: {
    items: DropdownItemType[];
  };
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}
