import type { ReactNode } from 'react';

export type InputNumberStatus = 'error' | 'warning';
export type InputNumberSize = 'sm' | 'md' | 'lg';

export interface InputNumberProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  readOnly?: boolean;
  status?: InputNumberStatus;
  size?: InputNumberSize;
  placeholder?: string;
  prefix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  formatter?: (value: number | string) => string;
  parser?: (displayValue: string) => number;
  onChange?: (value: number | null) => void;
  onStep?: (value: number, info: { offset: number; type: 'up' | 'down' }) => void;
  className?: string;
  style?: React.CSSProperties;
  controls?: boolean;
  keyboard?: boolean;
}
