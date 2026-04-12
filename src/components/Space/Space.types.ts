import type { HTMLAttributes, ReactNode } from 'react';

export type SpaceSize = 'sm' | 'md' | 'lg' | number;
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline';

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  size?: SpaceSize;
  align?: SpaceAlign;
  wrap?: boolean;
  split?: ReactNode;
  block?: boolean;
}
