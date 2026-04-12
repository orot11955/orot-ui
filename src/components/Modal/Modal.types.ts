import type { HTMLAttributes, ReactNode } from 'react';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  title?: ReactNode;
  footer?: ReactNode | null;
  width?: string | number;
  zIndex?: number;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  closeIcon?: ReactNode;
  getContainer?: HTMLElement | (() => HTMLElement) | false;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  confirmLoading?: boolean;
  keyboard?: boolean;
  mask?: boolean;
  afterClose?: () => void;
  afterOpenChange?: (open: boolean) => void;
  destroyOnHidden?: boolean;
}
