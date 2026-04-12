import { useState } from 'react';
import './FloatButton.css';
import type { FloatButtonGroupProps, FloatButtonProps } from './FloatButton.types';

function FloatButtonBase({
  icon,
  description,
  tooltip,
  type = 'default',
  shape = 'circle',
  href,
  badge,
  onClick,
  className = '',
  style,
}: FloatButtonProps) {
  const cls = [
    'orot-float-btn',
    `orot-float-btn--${type}`,
    `orot-float-btn--${shape}`,
    className,
  ].filter(Boolean).join(' ');

  const inner = (
    <>
      {badge && (
        <span className={['orot-float-btn__badge', badge.dot && 'orot-float-btn__badge--dot'].filter(Boolean).join(' ')}>
          {!badge.dot && badge.count !== undefined && badge.count > 0 ? badge.count : null}
        </span>
      )}
      {icon && <span className="orot-float-btn__icon">{icon}</span>}
      {description && <span className="orot-float-btn__desc">{description}</span>}
      {tooltip && <span className="orot-float-btn__tooltip">{tooltip}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} style={style} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={cls} style={style} onClick={onClick}>
      {inner}
    </button>
  );
}

function FloatButtonGroup({
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  type = 'default',
  shape = 'circle',
  icon,
  closeIcon,
  onOpenChange,
  children,
  className = '',
  style,
}: FloatButtonGroupProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;

  const toggle = () => {
    const next = !open;
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const triggerProps = trigger === 'hover'
    ? {
        onMouseEnter: () => { if (controlledOpen === undefined) setInternalOpen(true); onOpenChange?.(true); },
        onMouseLeave: () => { if (controlledOpen === undefined) setInternalOpen(false); onOpenChange?.(false); },
      }
    : { onClick: toggle };

  return (
    <div
      className={['orot-float-btn-group', open && 'orot-float-btn-group--open', className].filter(Boolean).join(' ')}
      style={style}
      {...triggerProps}
    >
      {open && <div className="orot-float-btn-group__items">{children}</div>}
      <FloatButtonBase
        icon={open ? (closeIcon ?? '✕') : icon}
        type={type}
        shape={shape}
      />
    </div>
  );
}

export function FloatButton(props: FloatButtonProps) {
  return <FloatButtonBase {...props} />;
}

FloatButton.Group = FloatButtonGroup;
FloatButton.BackTop = function BackTop({ onClick, style, className = '' }: Pick<FloatButtonProps, 'onClick' | 'style' | 'className'>) {
  return (
    <FloatButtonBase
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
          <path d="M12 4l-8 8h5v8h6v-8h5z"/>
        </svg>
      }
      onClick={(e) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClick?.(e);
      }}
      style={{ position: 'fixed', right: 24, bottom: 48, ...style }}
      className={className}
    />
  );
};
