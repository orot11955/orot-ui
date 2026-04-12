import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Popover.css';
import type { PopoverProps } from './Popover.types';

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

export function Popover({
  title,
  content,
  placement = 'top',
  trigger = 'hover',
  open: controlledOpen,
  defaultOpen = false,
  arrow = true,
  mouseEnterDelay = 0,
  mouseLeaveDelay = 0.1,
  destroyOnHidden = true,
  onOpenChange,
  children,
  className = '',
  style,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const open = controlledOpen ?? internalOpen;

  useEffect(() => () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const setOpen = (val: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(val);
    onOpenChange?.(val);
  };

  const schedule = (nextOpen: boolean, delaySecs: number) => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (delaySecs <= 0) { setOpen(nextOpen); return; }
    const id = window.setTimeout(() => setOpen(nextOpen), delaySecs * 1000);
    if (nextOpen) openTimerRef.current = id; else closeTimerRef.current = id;
  };

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !popupRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    setPos(calcPos(triggerRect, popupRef.current, placement));
  }, [open, placement]);

  const triggerProps =
    trigger === 'hover'
      ? { onMouseEnter: () => schedule(true, mouseEnterDelay), onMouseLeave: () => schedule(false, mouseLeaveDelay) }
      : trigger === 'focus'
        ? { onFocus: () => setOpen(true), onBlur: () => setOpen(false) }
        : { onClick: () => setOpen(!open) };

  const shouldRender = open || !destroyOnHidden;

  const popup = shouldRender ? (
    <div
      ref={popupRef}
      role="tooltip"
      hidden={!open}
      className={[
        'orot-popover',
        `orot-popover--${placement}`,
        !arrow && 'orot-popover--no-arrow',
      ].filter(Boolean).join(' ')}
      style={{
        position: 'fixed',
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        visibility: pos ? 'visible' : 'hidden',
        zIndex: 'var(--orot-z-tooltip)' as unknown as number,
        ...style,
      }}
    >
      {title && <div className="orot-popover__title">{title}</div>}
      {content && <div className="orot-popover__content">{content}</div>}
    </div>
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className={['orot-popover-wrapper', className].filter(Boolean).join(' ')}
        {...triggerProps}
      >
        {children}
      </span>
      {typeof document !== 'undefined' && createPortal(popup, document.body)}
    </>
  );
}
