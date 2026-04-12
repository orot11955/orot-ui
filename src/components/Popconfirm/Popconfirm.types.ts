import type { ReactNode } from 'react';
import type { TooltipPlacement } from '../Tooltip/Tooltip.types';
import type { ButtonVariant } from '../Button/Button.types';

export interface PopconfirmProps {
  title: ReactNode;
  description?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okType?: ButtonVariant;
  showCancel?: boolean;
  placement?: TooltipPlacement;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  icon?: ReactNode;
}
