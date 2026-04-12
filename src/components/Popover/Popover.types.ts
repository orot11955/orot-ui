import type { ReactNode } from 'react';

export type PopoverPlacement =
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom';

export type PopoverTrigger = 'hover' | 'click' | 'focus';

export interface PopoverProps {
  title?: ReactNode;
  content?: ReactNode;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  arrow?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  destroyOnHidden?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
