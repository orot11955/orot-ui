import type { ReactNode } from 'react';

export type TourPlacement =
  | 'center'
  | 'top' | 'topLeft' | 'topRight'
  | 'bottom' | 'bottomLeft' | 'bottomRight'
  | 'left' | 'leftTop' | 'leftBottom'
  | 'right' | 'rightTop' | 'rightBottom';

export interface TourStep {
  title?: ReactNode;
  description?: ReactNode;
  cover?: ReactNode;
  target?: HTMLElement | (() => HTMLElement | null) | null;
  placement?: TourPlacement;
  arrow?: boolean;
  mask?: boolean | { style?: React.CSSProperties; color?: string };
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  prevButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface TourProps {
  open?: boolean;
  defaultCurrent?: number;
  current?: number;
  steps?: TourStep[];
  mask?: boolean;
  arrow?: boolean;
  placement?: TourPlacement;
  zIndex?: number;
  closeIcon?: ReactNode;
  onClose?: () => void;
  onChange?: (current: number) => void;
  onFinish?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
