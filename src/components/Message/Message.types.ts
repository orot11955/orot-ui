import type { ReactNode } from 'react';

export type MessageType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export type MessageMethodConfig = Omit<MessageConfig, 'type'>;

export interface MessageMethod {
  (content: ReactNode, duration?: number): () => void;
  (config: MessageMethodConfig): () => void;
}

export interface MessageConfig {
  key?: string;
  content: ReactNode;
  type?: MessageType;
  duration?: number | null;
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onClose?: () => void;
}

export interface MessageInstance {
  open: (config: MessageConfig) => () => void;
  success: MessageMethod;
  info: MessageMethod;
  warning: MessageMethod;
  error: MessageMethod;
  loading: MessageMethod;
  destroy: (key?: string) => void;
}
