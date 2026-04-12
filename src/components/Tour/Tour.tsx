import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Tour.css';
import type { TourProps } from './Tour.types';

function calcTourPos(
  targetRect: DOMRect,
  panelEl: HTMLElement,
  placement: string,
  gap = 12,
): { top: number; left: number } {
  const pw = panelEl.offsetWidth;
  const ph = panelEl.offsetHeight;
  const { top, left, right, bottom, width, height } = targetRect;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let t: number, l: number;
  switch (placement) {
    case 'top':    t = top - ph - gap;  l = left + width / 2 - pw / 2; break;
    case 'bottom': t = bottom + gap;    l = left + width / 2 - pw / 2; break;
    case 'left':   t = top + height / 2 - ph / 2; l = left - pw - gap; break;
    case 'right':  t = top + height / 2 - ph / 2; l = right + gap;     break;
    default:       t = bottom + gap;    l = left + width / 2 - pw / 2; break;
  }

  // Clamp to viewport
  l = Math.max(8, Math.min(l, vw - pw - 8));
  t = Math.max(8, Math.min(t, vh - ph - 8));
  return { top: t, left: l };
}

export function Tour({
  open = false,
  defaultCurrent = 0,
  current: controlledCurrent,
  steps = [],
  mask = true,
  arrow = true,
  placement = 'bottom',
  zIndex = 1001,
  closeIcon,
  onClose,
  onChange,
  onFinish,
  className = '',
  style,
}: TourProps) {
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const current = controlledCurrent ?? internalCurrent;
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const step = steps[current];
  const total = steps.length;

  const go = (next: number) => {
    if (controlledCurrent === undefined) setInternalCurrent(next);
    onChange?.(next);
  };

  const handlePrev = () => { if (current > 0) go(current - 1); };
  const handleNext = () => {
    if (current < total - 1) go(current + 1);
    else { onFinish?.(); onClose?.(); }
  };

  useEffect(() => {
    if (!open || !step?.target) return;
    const target = typeof step.target === 'function' ? step.target() : step.target;
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [open, current]);

  useLayoutEffect(() => {
    if (!open || !step?.target || !panelRef.current) { setPos(null); return; }
    const target = typeof step.target === 'function' ? step.target() : step.target;
    if (!target) { setPos(null); return; }
    const targetRect = target.getBoundingClientRect();
    const stepPlacement = step.placement ?? placement;
    setPos(calcTourPos(targetRect, panelRef.current, stepPlacement));
  }, [open, current]);

  if (!open || !step) return null;

  const stepPlacement = step.placement ?? placement;
  const showMask = step.mask !== undefined ? step.mask !== false : mask;

  const content = (
    <div className="orot-tour-root" style={{ zIndex }} role="dialog" aria-modal="true">
      {showMask && <div className="orot-tour-mask" onClick={onClose} />}
      <div
        ref={panelRef}
        className={[
          'orot-tour',
          `orot-tour--${stepPlacement}`,
          !arrow && 'orot-tour--no-arrow',
          pos ? 'orot-tour--positioned' : '',
          className,
        ].filter(Boolean).join(' ')}
        style={pos ? { position: 'fixed', top: pos.top, left: pos.left, ...style } : style}
      >
        <button type="button" className="orot-tour__close" onClick={onClose} aria-label="Close tour">
          {closeIcon ?? '✕'}
        </button>

        {step.cover && <div className="orot-tour__cover">{step.cover}</div>}
        {step.title && <div className="orot-tour__title">{step.title}</div>}
        {step.description && <div className="orot-tour__desc">{step.description}</div>}

        <div className="orot-tour__footer">
          <div className="orot-tour__indicators">
            {steps.map((_, i) => (
              <span
                key={i}
                className={['orot-tour__dot', i === current && 'orot-tour__dot--active'].filter(Boolean).join(' ')}
              />
            ))}
          </div>
          <div className="orot-tour__actions">
            {current > 0 && (
              <button
                type="button"
                className="orot-tour__btn orot-tour__btn--prev"
                onClick={handlePrev}
                {...step.prevButtonProps}
              >
                {step.prevButtonProps?.children ?? 'Prev'}
              </button>
            )}
            <button
              type="button"
              className="orot-tour__btn orot-tour__btn--next"
              onClick={handleNext}
              {...step.nextButtonProps}
            >
              {step.nextButtonProps?.children ?? (current < total - 1 ? 'Next' : 'Finish')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
