import type { HTMLAttributes } from 'react';

export type ProgressType = 'line' | 'circle' | 'dashboard';
export type ProgressStatus = 'normal' | 'success' | 'exception' | 'active';
export interface ProgressSuccessConfig {
  percent?: number;
  strokeColor?: string;
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  type?: ProgressType;
  percent?: number;
  status?: ProgressStatus;
  showInfo?: boolean;
  strokeWidth?: number;
  size?: 'sm' | 'md';
  format?: (percent: number) => string;
  strokeColor?: string;
  trailColor?: string;
  steps?: number;
  success?: ProgressSuccessConfig;
}
