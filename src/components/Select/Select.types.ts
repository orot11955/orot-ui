import type { HTMLAttributes, ReactNode } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectStatus = 'error' | 'warning';
export type SelectMode = 'multiple';

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  mode?: SelectMode;
  showSearch?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: SelectSize;
  status?: SelectStatus;
  name?: string;
  filterOption?: boolean | ((inputValue: string, option: SelectOption) => boolean);
  optionFilterProp?: 'label' | 'value';
  notFoundContent?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (value: string) => void;
  onChange?: (value: string | number | (string | number)[] | undefined) => void;
}
