import type { CSSProperties, ReactNode } from 'react';

export interface RateProps {
  count?: number;
  value?: number;
  defaultValue?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  tooltips?: string[];
  character?: ReactNode | ((index: number) => ReactNode);
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
}
