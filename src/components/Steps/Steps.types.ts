import type { HTMLAttributes, ReactNode } from 'react';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepsDirection = 'horizontal' | 'vertical';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
  status?: StepStatus;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: StepItem[];
  current?: number;
  direction?: StepsDirection;
  progressDot?: boolean;
  size?: 'sm' | 'md';
  onChange?: (current: number) => void;
}
