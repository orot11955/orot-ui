import type { HTMLAttributes, ReactNode } from 'react';

export type TooltipPlacement =
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom';

export type TooltipTrigger = 'hover' | 'click' | 'focus';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title'> {
  title: ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  color?: string;
  arrow?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  destroyOnHidden?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}
