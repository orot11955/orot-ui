import './Button.css';
import type { ButtonProps } from './Button.types';

export function Button({
  variant = 'solid',
  size = 'md',
  shape = 'default',
  loading = false,
  icon,
  iconPlacement,
  iconPosition,
  block = false,
  danger = false,
  ghost = false,
  htmlType,
  disabled,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  // iconPosition 우선, iconPlacement 하위 호환, 기본값 'start'
  const resolvedIconPos = iconPosition ?? iconPlacement ?? 'start';
  const iconOnly = !!icon && !children;

  const cls = [
    'orot-btn',
    `orot-btn--${variant}`,
    `orot-btn--${size}`,
    shape !== 'default' && `orot-btn--${shape}`,
    danger && 'orot-btn--danger',
    ghost && 'orot-btn--ghost',
    block && 'orot-btn--block',
    loading && 'orot-btn--loading',
    iconOnly && 'orot-btn--icon-only',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={htmlType ?? type}
      className={cls}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="orot-btn__spinner" aria-hidden="true" />
      ) : (
        icon && resolvedIconPos === 'start' && (
          <span className="orot-btn__icon">{icon}</span>
        )
      )}

      {children && <span className="orot-btn__label">{children}</span>}

      {!loading && icon && resolvedIconPos === 'end' && (
        <span className="orot-btn__icon">{icon}</span>
      )}
    </button>
  );
}
