import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type TagColor = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TagColor | string;
  closable?: boolean;
  bordered?: boolean;
  icon?: ReactNode;
  onClose?: () => void;
}

export interface TagCheckableProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  icon?: ReactNode;
  onChange?: (checked: boolean) => void;
}
