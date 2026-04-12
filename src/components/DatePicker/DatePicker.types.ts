export type DatePickerStatus = 'error' | 'warning';
export type DatePickerSize = 'sm' | 'md' | 'lg';
export type DatePickerPicker = 'date' | 'week' | 'month' | 'quarter' | 'year';

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  picker?: DatePickerPicker;
  format?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showToday?: boolean;
  status?: DatePickerStatus;
  size?: DatePickerSize;
  placeholder?: string;
  disabledDate?: (date: Date) => boolean;
  onChange?: (date: Date | null, dateString: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface RangePickerProps {
  value?: [Date | null, Date | null];
  defaultValue?: [Date | null, Date | null];
  disabled?: boolean | [boolean, boolean];
  allowClear?: boolean;
  status?: DatePickerStatus;
  size?: DatePickerSize;
  placeholder?: [string, string];
  disabledDate?: (date: Date) => boolean;
  onChange?: (dates: [Date | null, Date | null], dateStrings: [string, string]) => void;
  className?: string;
  style?: React.CSSProperties;
}
