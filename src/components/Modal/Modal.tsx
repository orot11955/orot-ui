import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import type { ModalProps } from './Modal.types';

export function Modal({
  open,
  title,
  footer,
  width = 520,
  zIndex,
  closable = true,
  maskClosable = true,
  centered = false,
  closeIcon,
  getContainer,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  confirmLoading = false,
  keyboard = true,
  mask = true,
  afterClose,
  afterOpenChange,
  destroyOnHidden = false,
  children,
  className = '',
  style,
  ...rest
}: ModalProps) {
  const previousOpenRef = useRef(open);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [open]);

  useEffect(() => {
    afterOpenChange?.(open);
    if (previousOpenRef.current && !open) {
      afterClose?.();
    }
    previousOpenRef.current = open;
  }, [afterClose, afterOpenChange, open]);

  if (!open && destroyOnHidden) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mask && maskClosable && event.target === event.currentTarget) onCancel?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (keyboard && event.key === 'Escape') onCancel?.();
  };

  const hasFooter = footer !== null;
  const defaultFooter = (
    <>
      <button
        type="button"
        className="orot-btn orot-btn--outlined orot-btn--md"
        onClick={onCancel}
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={[
          'orot-btn',
          'orot-btn--solid',
          'orot-btn--md',
          confirmLoading && 'orot-btn--loading',
        ].filter(Boolean).join(' ')}
        onClick={onOk}
        disabled={confirmLoading}
      >
        {confirmLoading ? <span className="orot-btn__spinner" aria-hidden="true" /> : okText}
      </button>
    </>
  );

  const modal = (
    <div
      className={`orot-modal-overlay${centered ? ' orot-modal-overlay--centered' : ''}`}
      hidden={!open}
      style={{
        ...(zIndex !== undefined ? { zIndex } : {}),
        ...(!open ? { display: 'none' } : {}),
        ...(!mask ? { background: 'transparent' } : {}),
      }}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={['orot-modal', className].filter(Boolean).join(' ')}
        style={{ width: typeof width === 'number' ? `${width}px` : width, ...style }}
        {...rest}
      >
        {(title !== undefined || closable) && (
          <div className="orot-modal__header">
            {title !== undefined && (
              <div id={titleId} className="orot-modal__title">{title}</div>
            )}
            {closable && (
              <button
                type="button"
                className="orot-modal__close"
                onClick={onCancel}
                aria-label="Close modal"
              >
                {closeIcon ?? '✕'}
              </button>
            )}
          </div>
        )}

        <div className="orot-modal__body">{children}</div>

        {hasFooter && (
          <div className="orot-modal__footer">
            {footer ?? defaultFooter}
          </div>
        )}
      </div>
    </div>
  );

  if (getContainer === false) {
    return modal;
  }

  const container = typeof getContainer === 'function'
    ? getContainer()
    : getContainer ?? document.body;

  return createPortal(modal, container);
}
