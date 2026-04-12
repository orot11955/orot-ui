import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  loading?: boolean;
  size?: SwitchSize;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
  onChange?: (checked: boolean) => void;
}
