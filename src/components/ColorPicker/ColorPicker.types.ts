export type ColorFormat = 'hex' | 'rgb' | 'hsb';
export type ColorPickerSize = 'sm' | 'md' | 'lg';

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  format?: ColorFormat;
  disabled?: boolean;
  allowClear?: boolean;
  showText?: boolean;
  size?: ColorPickerSize;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (color: string) => void;
  onClear?: () => void;
  presets?: Array<{ label: string; colors: string[] }>;
  className?: string;
  style?: React.CSSProperties;
}
