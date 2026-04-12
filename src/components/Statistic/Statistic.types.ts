import type { ReactNode } from 'react';

export interface StatisticProps {
  title?: ReactNode;
  value?: number | string;
  valueStyle?: React.CSSProperties;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  decimalSeparator?: string;
  groupSeparator?: string;
  formatter?: (value: number | string) => ReactNode;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface CountdownProps {
  title?: ReactNode;
  value: number | string | Date;
  format?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  valueStyle?: React.CSSProperties;
  onFinish?: () => void;
  onChange?: (value: number) => void;
  className?: string;
  style?: React.CSSProperties;
}
