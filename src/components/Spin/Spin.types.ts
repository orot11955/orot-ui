import type { HTMLAttributes, ReactNode } from 'react';

export type SpinSize = 'sm' | 'md' | 'lg';

export interface SpinProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinSize;
  tip?: ReactNode;
  spinning?: boolean;
  delay?: number;
  fullscreen?: boolean;
  indicator?: ReactNode;
}
