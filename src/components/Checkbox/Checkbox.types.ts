import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
}

export interface CheckboxGroupProps {
  options: CheckboxOptionType[];
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
  onChange?: (values: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface CheckboxOptionType {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}
