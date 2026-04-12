import type { HTMLAttributes, ReactNode } from 'react';

export type CardSize = 'sm' | 'md';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  size?: CardSize;
  actions?: ReactNode[];
  loading?: boolean;
  hoverable?: boolean;
}
