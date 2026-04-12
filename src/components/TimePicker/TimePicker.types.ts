export type TimePickerStatus = 'error' | 'warning';
export type TimePickerSize = 'sm' | 'md' | 'lg';

export interface TimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  format?: string;
  disabled?: boolean;
  allowClear?: boolean;
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  status?: TimePickerStatus;
  size?: TimePickerSize;
  placeholder?: string;
  disabledTime?: () => { disabledHours?: () => number[]; disabledMinutes?: (h: number) => number[]; disabledSeconds?: (h: number, m: number) => number[] };
  onChange?: (time: Date | null, timeString: string) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}
