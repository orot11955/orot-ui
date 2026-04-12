import type { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  value?: string | number;
  children?: ReactNode;
  onChange?: (value: string | number) => void;
}

export interface RadioGroupProps {
  options?: RadioOptionType[];
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  buttonStyle?: 'outline' | 'solid';
  optionType?: 'default' | 'button';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  onChange?: (value: string | number) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
}

export interface RadioOptionType {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}
