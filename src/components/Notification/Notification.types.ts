import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';

export interface NotificationConfig {
  key?: string;
  message: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  type?: NotificationType;
  btn?: ReactNode;
  placement?: NotificationPlacement;
  duration?: number | null;
  closable?: boolean;
  closeIcon?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClose?: () => void;
  onClick?: () => void;
}

export interface NotificationInstance {
  open: (config: NotificationConfig) => void;
  success: (config: Omit<NotificationConfig, 'type'>) => void;
  info: (config: Omit<NotificationConfig, 'type'>) => void;
  warning: (config: Omit<NotificationConfig, 'type'>) => void;
  error: (config: Omit<NotificationConfig, 'type'>) => void;
  destroy: (key?: string) => void;
}
