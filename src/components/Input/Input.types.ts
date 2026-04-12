import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputStatus = 'error' | 'warning';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: InputSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  allowClear?: boolean;
  status?: InputStatus;
  /** 글자 수 카운터 표시. maxLength와 함께 사용 시 n/max 형식 */
  showCount?: boolean;
}
