import type { HTMLAttributes, ReactNode } from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: AlertType;
  /** 알림 주 메시지. title과 동일 (하나만 사용) */
  message?: ReactNode;
  /** message의 alias — 현재 API 감각에 맞게 추가 */
  title?: ReactNode;
  description?: ReactNode;
  closable?: boolean;
  showIcon?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  banner?: boolean;
  onClose?: () => void;
}
