import type { ReactNode } from 'react';

export type TimelineMode = 'left' | 'alternate' | 'right';

export interface TimelineItemProps {
  color?: string;
  dot?: ReactNode;
  label?: ReactNode;
  pending?: boolean;
  position?: 'left' | 'right';
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineProps {
  mode?: TimelineMode;
  pending?: ReactNode | boolean;
  pendingDot?: ReactNode;
  reverse?: boolean;
  items?: TimelineItemProps[];
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
