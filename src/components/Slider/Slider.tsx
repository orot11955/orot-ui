import { useState, useRef, useCallback } from 'react';
import './Slider.css';
import type { SliderProps, SliderValue } from './Slider.types';

export function Slider({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  range = false,
  disabled = false,
  vertical = false,
  included = true,
  marks,
  tooltip,
  dots = false,
  onChange,
  onChangeComplete,
  className = '',
  style,
}: SliderProps) {
  const getInitial = (): SliderValue => {
    if (defaultValue !== undefined) return defaultValue;
    return range ? [min, max] : min;
  };

  const [internalValue, setInternalValue] = useState<SliderValue>(getInitial);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const values: [number, number] = range
    ? (value as [number, number])
    : [min, value as number];

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const positionFromEvent = useCallback(
    (clientPos: number): number => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = vertical
        ? 1 - (clientPos - rect.top) / rect.height
        : (clientPos - rect.left) / rect.width;
      const raw = min + ratio * (max - min);
      if (step === null) return clamp(raw);
      return clamp(Math.round(raw / step) * step);
    },
    [min, max, step, vertical],
  );

  const commit = (nextVal: SliderValue) => {
    if (controlledValue === undefined) setInternalValue(nextVal);
    onChange?.(nextVal);
  };

  const commitComplete = (nextVal: SliderValue) => {
    onChangeComplete?.(nextVal);
  };

  const handleThumbPointerDown = (e: React.PointerEvent, thumbIndex: number) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setActiveThumb(thumbIndex);
  };

  const handleThumbPointerMove = (e: React.PointerEvent, thumbIndex: number) => {
    if (disabled || activeThumb !== thumbIndex) return;
    const pos = positionFromEvent(vertical ? e.clientY : e.clientX);
    if (range) {
      const next: [number, number] = [...(value as [number, number])] as [number, number];
      next[thumbIndex] = pos;
      if (next[0] > next[1]) next.reverse();
      commit(next);
    } else {
      commit(pos);
    }
  };

  const handleThumbPointerUp = (e: React.PointerEvent, thumbIndex: number) => {
    setActiveThumb(null);
    const pos = positionFromEvent(vertical ? e.clientY : e.clientX);
    if (range) {
      const next: [number, number] = [...(value as [number, number])] as [number, number];
      next[thumbIndex] = pos;
      if (next[0] > next[1]) next.reverse();
      commitComplete(next);
    } else {
      commitComplete(pos);
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const pos = positionFromEvent(vertical ? e.clientY : e.clientX);
    if (range) {
      const [lo, hi] = value as [number, number];
      const nextArr: [number, number] =
        Math.abs(pos - lo) <= Math.abs(pos - hi) ? [pos, hi] : [lo, pos];
      commit(nextArr);
      commitComplete(nextArr);
    } else {
      commit(pos);
      commitComplete(pos);
    }
  };

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const [lo, hi] = values;
  const loPct = pct(lo);
  const hiPct = pct(hi);

  const trackFillStyle = vertical
    ? { bottom: `${loPct}%`, height: `${hiPct - loPct}%` }
    : { left: `${loPct}%`, width: `${hiPct - loPct}%` };

  const thumbPositions = range ? [lo, hi] : [hi];

  const showTooltip = (v: number) => {
    if (tooltip?.formatter === null) return null;
    const content = tooltip?.formatter ? tooltip.formatter(v) : String(v);
    return <span className="orot-slider__tooltip">{content}</span>;
  };

  const markKeys = marks ? Object.keys(marks).map(Number) : [];

  return (
    <div
      className={[
        'orot-slider',
        vertical && 'orot-slider--vertical',
        disabled && 'orot-slider--disabled',
        marks && markKeys.length > 0 && 'orot-slider--has-marks',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div
        ref={trackRef}
        className="orot-slider__track"
        onClick={handleTrackClick}
      >
        {included && (
          <div className="orot-slider__fill" style={trackFillStyle} />
        )}

        {dots && step !== null && Array.from(
          { length: Math.floor((max - min) / step) + 1 },
          (_, i) => min + i * step,
        ).map((dotVal) => {
          const p = pct(dotVal);
          const active = dotVal >= lo && dotVal <= hi;
          return (
            <div
              key={dotVal}
              className={['orot-slider__dot', active && 'orot-slider__dot--active'].filter(Boolean).join(' ')}
              style={vertical ? { bottom: `${p}%` } : { left: `${p}%` }}
            />
          );
        })}

        {thumbPositions.map((thumbVal, i) => {
          const p = pct(thumbVal);
          const thumbStyle = vertical ? { bottom: `${p}%` } : { left: `${p}%` };
          return (
            <div
              key={i}
              className={['orot-slider__thumb', activeThumb === i && 'orot-slider__thumb--active'].filter(Boolean).join(' ')}
              style={thumbStyle}
              role="slider"
              aria-valuenow={thumbVal}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={(e) => handleThumbPointerDown(e, i)}
              onPointerMove={(e) => handleThumbPointerMove(e, i)}
              onPointerUp={(e) => handleThumbPointerUp(e, i)}
              onKeyDown={(e) => {
                if (disabled || step === null) return;
                const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -step : 0;
                if (!delta) return;
                e.preventDefault();
                const next = clamp(thumbVal + delta);
                if (range) {
                  const arr = [...(value as [number, number])] as [number, number];
                  arr[i] = next;
                  commit(arr);
                } else {
                  commit(next);
                }
              }}
            >
              {showTooltip(thumbVal)}
            </div>
          );
        })}
      </div>

      {marks && markKeys.length > 0 && (
        <div className="orot-slider__marks">
          {markKeys.map((markVal) => {
            const p = pct(markVal);
            const mark = marks[markVal];
            const label: React.ReactNode = typeof mark === 'object' && mark !== null && 'label' in (mark as object)
              ? (mark as { label: React.ReactNode }).label
              : (mark as React.ReactNode);
            const markStyle = typeof mark === 'object' && mark !== null && 'style' in (mark as object)
              ? (mark as { style?: React.CSSProperties }).style
              : undefined;
            return (
              <span
                key={markVal}
                className="orot-slider__mark"
                style={{ ...(vertical ? { bottom: `${p}%` } : { left: `${p}%` }), ...markStyle }}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
