import type { ReactNode } from 'react';

export type SliderValue = number | [number, number];

export interface SliderMarks {
  [key: number]: ReactNode | { label: ReactNode; style?: React.CSSProperties };
}

export interface SliderProps {
  value?: SliderValue;
  defaultValue?: SliderValue;
  min?: number;
  max?: number;
  step?: number | null;
  range?: boolean;
  disabled?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  included?: boolean;
  marks?: SliderMarks;
  tooltip?: { formatter?: ((value: number) => ReactNode) | null; open?: boolean };
  dots?: boolean;
  onChange?: (value: SliderValue) => void;
  onChangeComplete?: (value: SliderValue) => void;
  className?: string;
  style?: React.CSSProperties;
}
