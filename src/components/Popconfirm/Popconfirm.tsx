import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button';
import './Popconfirm.css';
import type { PopconfirmProps } from './Popconfirm.types';

function calcPos(
  triggerRect: DOMRect,
  popupEl: HTMLElement,
  placement: string,
): { top: number; left: number } {
  const GAP = 8;
  const pw = popupEl.offsetWidth;
  const ph = popupEl.offsetHeight;
  const { top, left, right, bottom, width, height } = triggerRect;

  switch (placement) {
    case 'top':         return { top: top - ph - GAP, left: left + width / 2 - pw / 2 };
    case 'topLeft':     return { top: top - ph - GAP, left };
    case 'topRight':    return { top: top - ph - GAP, left: right - pw };
    case 'bottom':      return { top: bottom + GAP, left: left + width / 2 - pw / 2 };
    case 'bottomLeft':  return { top: bottom + GAP, left };
    case 'bottomRight': return { top: bottom + GAP, left: right - pw };
    case 'left':        return { top: top + height / 2 - ph / 2, left: left - pw - GAP };
    case 'leftTop':     return { top, left: left - pw - GAP };
    case 'leftBottom':  return { top: bottom - ph, left: left - pw - GAP };
    case 'right':       return { top: top + height / 2 - ph / 2, left: right + GAP };
    case 'rightTop':    return { top, left: right + GAP };
    case 'rightBottom': return { top: bottom - ph, left: right + GAP };
    default:            return { top: top - ph - GAP, left: left + width / 2 - pw / 2 };
  }
}

export function Popconfirm({
  title,
  description,
  onConfirm,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'solid',
  showCancel = true,
  placement = 'top',
  disabled = false,
  open: controlledOpen,
  onOpenChange,
  children,
  icon = '⚠',
}: PopconfirmProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const setOpen = (val: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(val);
    onOpenChange?.(val);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popupRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    setPos(calcPos(triggerRect, popupRef.current, placement));
  }, [open, placement]);

  const handleConfirm = () => { setOpen(false); onConfirm?.(); };
  const handleCancel = () => { setOpen(false); onCancel?.(); };

  const popup = open && !disabled ? (
    <div
      ref={popupRef}
      className={`orot-popconfirm orot-popconfirm--${placement}`}
      style={{
        position: 'fixed',
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        visibility: pos ? 'visible' : 'hidden',
        zIndex: 'var(--orot-z-popover)' as unknown as number,
      }}
    >
      <div className="orot-popconfirm__content">
        {icon && <span className="orot-popconfirm__icon">{icon}</span>}
        <div className="orot-popconfirm__text">
          <div className="orot-popconfirm__title">{title}</div>
          {description && <div className="orot-popconfirm__description">{description}</div>}
        </div>
      </div>
      <div className="orot-popconfirm__buttons">
        {showCancel && (
          <Button size="sm" variant="outlined" onClick={handleCancel}>{cancelText}</Button>
        )}
        <Button size="sm" variant={okType} onClick={handleConfirm}>{okText}</Button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <span ref={triggerRef} className="orot-popconfirm-wrapper">
        <span onClick={() => !disabled && setOpen(!open)}>{children}</span>
      </span>
      {typeof document !== 'undefined' && createPortal(popup, document.body)}
    </>
  );
}
