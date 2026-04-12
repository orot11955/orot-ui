import type { HTMLAttributes } from 'react';

export interface SplitterPanelProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  defaultSize?: number;
  min?: number;
  max?: number;
  resizable?: boolean;
}

export interface SplitterProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  onResize?: (sizes: number[]) => void;
  onResizeStart?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
}
