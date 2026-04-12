import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeStatus = 'success' | 'processing' | 'error' | 'default' | 'warning';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number | ReactNode;
  dot?: boolean;
  overflowCount?: number;
  showZero?: boolean;
  status?: BadgeStatus;
  color?: string;
  text?: ReactNode;
  children?: ReactNode;
}
