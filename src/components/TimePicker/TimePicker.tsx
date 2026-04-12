import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TimePicker.css';
import type { TimePickerProps } from './TimePicker.types';

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatTime(date: Date | null, _fmt?: string, use12 = false): string {
  if (!date) return '';
  let h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  if (use12) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function buildColumn(count: number, step: number, disabled: number[] = []): number[] {
  const items: number[] = [];
  for (let i = 0; i < count; i += step) {
    if (!disabled.includes(i)) items.push(i);
  }
  return items;
}

export function TimePicker({
  value: controlledValue,
  defaultValue = null,
  format,
  disabled = false,
  allowClear = true,
  use12Hours = false,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  showHour = true,
  showMinute = true,
  showSecond = true,
  status,
  size = 'md',
  placeholder = 'Select time',
  disabledTime,
  onChange,
  onOpenChange,
  className = '',
  style,
}: TimePickerProps) {
  const now = new Date();
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(defaultValue?.getHours() ?? now.getHours());
  const [minute, setMinute] = useState(defaultValue?.getMinutes() ?? now.getMinutes());
  const [second, setSecond] = useState(defaultValue?.getSeconds() ?? now.getSeconds());
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setDropdownOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setPos(null);
    onOpenChange?.(next);
  };

  const updatePos = () => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left, width: r.width });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const disabledInfo = disabledTime?.() ?? {};
  const disabledH = disabledInfo.disabledHours?.() ?? [];
  const disabledM = disabledInfo.disabledMinutes?.(hour) ?? [];
  const disabledS = disabledInfo.disabledSeconds?.(hour, minute) ?? [];

  const hours = buildColumn(use12Hours ? 12 : 24, hourStep, disabledH);
  const minutes = buildColumn(60, minuteStep, disabledM);
  const seconds = buildColumn(60, secondStep, disabledS);

  const commit = (h: number, m: number, s: number) => {
    const d = new Date();
    d.setHours(h, m, s, 0);
    if (controlledValue === undefined) setInternalValue(d);
    onChange?.(d, formatTime(d, format, use12Hours));
  };

  const handleOk = () => {
    commit(hour, minute, second);
    setDropdownOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) setInternalValue(null);
    onChange?.(null, '');
  };

  const displayText = formatTime(value, format, use12Hours);

  return (
    <div
      ref={containerRef}
      className={[
        'orot-timepicker',
        `orot-timepicker--${size}`,
        status && `orot-timepicker--${status}`,
        disabled && 'orot-timepicker--disabled',
        open && 'orot-timepicker--open',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div
        className="orot-timepicker__selector"
        onClick={() => !disabled && setDropdownOpen(!open)}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={displayText ? 'orot-timepicker__value' : 'orot-timepicker__placeholder'}>
          {displayText || placeholder}
        </span>
        <span className="orot-timepicker__icons">
          {allowClear && value && !disabled && (
            <button type="button" className="orot-timepicker__clear" onClick={handleClear} tabIndex={-1}>✕</button>
          )}
          <span className="orot-timepicker__icon">🕐</span>
        </span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
        <div
          ref={dropdownRef}
          className="orot-timepicker__dropdown"
          style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
        >
          <div className="orot-timepicker__columns">
            {showHour && (
              <div className="orot-timepicker__column">
                {hours.map(h => (
                  <button
                    key={h}
                    type="button"
                    className={['orot-timepicker__cell', h === hour && 'orot-timepicker__cell--selected'].filter(Boolean).join(' ')}
                    onClick={() => { setHour(h); }}
                  >
                    {pad(h)}
                  </button>
                ))}
              </div>
            )}
            {showMinute && (
              <div className="orot-timepicker__column">
                {minutes.map(m => (
                  <button
                    key={m}
                    type="button"
                    className={['orot-timepicker__cell', m === minute && 'orot-timepicker__cell--selected'].filter(Boolean).join(' ')}
                    onClick={() => setMinute(m)}
                  >
                    {pad(m)}
                  </button>
                ))}
              </div>
            )}
            {showSecond && (
              <div className="orot-timepicker__column">
                {seconds.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={['orot-timepicker__cell', s === second && 'orot-timepicker__cell--selected'].filter(Boolean).join(' ')}
                    onClick={() => setSecond(s)}
                  >
                    {pad(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="orot-timepicker__footer">
            <button type="button" className="orot-timepicker__ok-btn" onClick={handleOk}>OK</button>
          </div>
        </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}
