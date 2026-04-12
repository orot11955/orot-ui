import type { ReactNode } from 'react';

export interface AutoCompleteOption {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
}

export type AutoCompleteStatus = 'error' | 'warning';
export type AutoCompleteSize = 'sm' | 'md' | 'lg';

export interface AutoCompleteProps {
  options?: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  status?: AutoCompleteStatus;
  size?: AutoCompleteSize;
  filterOption?: boolean | ((inputValue: string, option: AutoCompleteOption) => boolean);
  notFoundContent?: ReactNode;
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}
