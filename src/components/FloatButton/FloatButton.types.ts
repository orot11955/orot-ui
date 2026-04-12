import type { ReactNode } from 'react';

export type FloatButtonShape = 'circle' | 'square';
export type FloatButtonType = 'default' | 'primary';

export interface FloatButtonProps {
  icon?: ReactNode;
  description?: ReactNode;
  tooltip?: ReactNode;
  type?: FloatButtonType;
  shape?: FloatButtonShape;
  href?: string;
  target?: string;
  badge?: { count?: number; dot?: boolean };
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

export interface FloatButtonGroupProps {
  trigger?: 'click' | 'hover';
  open?: boolean;
  defaultOpen?: boolean;
  type?: FloatButtonType;
  shape?: FloatButtonShape;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
