export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned';
export type QRCodeErrorLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeProps {
  value: string;
  size?: number;
  color?: string;
  bgColor?: string;
  bordered?: boolean;
  errorLevel?: QRCodeErrorLevel;
  status?: QRCodeStatus;
  icon?: string;
  iconSize?: number;
  onRefresh?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
