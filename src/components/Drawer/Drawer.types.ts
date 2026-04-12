import type { ReactNode } from 'react';

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
  open: boolean;
  title?: ReactNode;
  placement?: DrawerPlacement;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  closeIcon?: ReactNode;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  footer?: ReactNode;
  extra?: ReactNode;
  zIndex?: number;
  destroyOnHidden?: boolean;
  afterOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
