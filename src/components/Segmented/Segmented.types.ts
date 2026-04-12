import type { ReactNode } from 'react';

export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedOption {
  value: string | number;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface SegmentedProps {
  options: (string | number | SegmentedOption)[];
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  size?: SegmentedSize;
  block?: boolean;
  onChange?: (value: string | number) => void;
  className?: string;
  style?: React.CSSProperties;
}
