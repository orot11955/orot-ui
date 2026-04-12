import { useState } from 'react';
import './Alert.css';
import type { AlertProps, AlertType } from './Alert.types';

const DEFAULT_ICONS: Record<AlertType, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export function Alert({
  type = 'info',
  message,
  title,
  description,
  closable = false,
  showIcon = false,
  icon,
  action,
  banner = false,
  onClose,
  className = '',
  style,
  ...rest
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  const cls = [
    'orot-alert',
    `orot-alert--${type}`,
    banner && 'orot-alert--banner',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="alert" className={cls} style={style} {...rest}>
      {showIcon && (
        <span className="orot-alert__icon">
          {icon ?? DEFAULT_ICONS[type]}
        </span>
      )}
      <div className="orot-alert__content">
        <div className="orot-alert__message">{title ?? message}</div>
        {description && <div className="orot-alert__description">{description}</div>}
      </div>
      {action && <div className="orot-alert__action">{action}</div>}
      {closable && (
        <button
          type="button"
          className="orot-alert__close"
          onClick={handleClose}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
