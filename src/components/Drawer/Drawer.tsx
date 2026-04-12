import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Drawer.css';
import type { DrawerProps } from './Drawer.types';

export function Drawer({
  open,
  title,
  placement = 'right',
  width = 378,
  height = 378,
  closable = true,
  closeIcon,
  mask = true,
  maskClosable = true,
  keyboard = true,
  footer,
  extra,
  zIndex,
  destroyOnHidden = false,
  afterOpenChange,
  onClose,
  getContainer,
  children,
  className = '',
  style,
}: DrawerProps) {
  const previousOpenRef = useRef(open);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (previousOpenRef.current !== open) {
      afterOpenChange?.(open);
      previousOpenRef.current = open;
    }
  }, [open, afterOpenChange]);

  useEffect(() => {
    if (!keyboard) return undefined;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keyboard, open, onClose]);

  if (!open && destroyOnHidden) return null;

  const isHorizontal = placement === 'left' || placement === 'right';
  const sizeStyle: React.CSSProperties = isHorizontal
    ? { width: typeof width === 'number' ? `${width}px` : width }
    : { height: typeof height === 'number' ? `${height}px` : height };

  const drawer = (
    <div
      className={`orot-drawer-root${open ? ' orot-drawer-root--open' : ''}`}
      style={{ zIndex, display: open ? undefined : 'none' }}
      role="presentation"
    >
      {mask && (
        <div
          className="orot-drawer-mask"
          onClick={() => maskClosable && onClose?.()}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        className={[
          'orot-drawer',
          `orot-drawer--${placement}`,
          open && 'orot-drawer--open',
          className,
        ].filter(Boolean).join(' ')}
        style={{ ...sizeStyle, ...style }}
      >
        {(title !== undefined || closable || extra) && (
          <div className="orot-drawer__header">
            {title !== undefined && <div className="orot-drawer__title">{title}</div>}
            <div className="orot-drawer__header-extra">
              {extra}
              {closable && (
                <button
                  type="button"
                  className="orot-drawer__close"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  {closeIcon ?? '✕'}
                </button>
              )}
            </div>
          </div>
        )}
        <div className="orot-drawer__body">{children}</div>
        {footer && <div className="orot-drawer__footer">{footer}</div>}
      </div>
    </div>
  );

  if (getContainer === false) return drawer;
  const container = typeof getContainer === 'function' ? getContainer() : getContainer ?? document.body;
  return createPortal(drawer, container);
}
