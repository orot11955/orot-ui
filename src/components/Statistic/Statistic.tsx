import { useEffect, useRef, useState } from 'react';
import './Statistic.css';
import type { CountdownProps, StatisticProps } from './Statistic.types';

function formatNumber(
  value: number | string,
  precision?: number,
  decimalSeparator = '.',
  groupSeparator = ',',
): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return String(value);

  const fixed = precision !== undefined ? num.toFixed(precision) : String(num);
  const [int, dec] = fixed.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
  return dec !== undefined ? `${grouped}${decimalSeparator}${dec}` : grouped;
}

export function Statistic({
  title,
  value = 0,
  valueStyle,
  prefix,
  suffix,
  precision,
  decimalSeparator = '.',
  groupSeparator = ',',
  formatter,
  loading = false,
  className = '',
  style,
}: StatisticProps) {
  const displayValue = formatter
    ? formatter(value)
    : formatNumber(value, precision, decimalSeparator, groupSeparator);

  return (
    <div className={['orot-statistic', className].filter(Boolean).join(' ')} style={style}>
      {title && <div className="orot-statistic__title">{title}</div>}
      <div className="orot-statistic__content">
        {loading ? (
          <div className="orot-statistic__loading">
            <span className="orot-statistic__loading-bar" />
          </div>
        ) : (
          <span className="orot-statistic__value" style={valueStyle}>
            {prefix && <span className="orot-statistic__prefix">{prefix}</span>}
            {displayValue}
            {suffix && <span className="orot-statistic__suffix">{suffix}</span>}
          </span>
        )}
      </div>
    </div>
  );
}

function parseCountdownTarget(value: number | string | Date): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  return new Date(value).getTime();
}

function formatCountdown(ms: number, format = 'HH:mm:ss'): string {
  const totalSecs = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return format
    .replace('HH', String(h).padStart(2, '0'))
    .replace('mm', String(m).padStart(2, '0'))
    .replace('ss', String(s).padStart(2, '0'));
}

function Countdown({
  title,
  value,
  format = 'HH:mm:ss',
  prefix,
  suffix,
  valueStyle,
  onFinish,
  onChange,
  className = '',
  style,
}: CountdownProps) {
  const target = parseCountdownTarget(value);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));
  const finishedRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish?.();
      }
      return;
    }

    const id = setInterval(() => {
      const next = Math.max(0, target - Date.now());
      setRemaining(next);
      onChange?.(next);
      if (next <= 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [target, onFinish, onChange]);

  return (
    <div className={['orot-statistic', className].filter(Boolean).join(' ')} style={style}>
      {title && <div className="orot-statistic__title">{title}</div>}
      <div className="orot-statistic__content">
        <span className="orot-statistic__value orot-statistic__value--countdown" style={valueStyle}>
          {prefix && <span className="orot-statistic__prefix">{prefix}</span>}
          {formatCountdown(remaining, format)}
          {suffix && <span className="orot-statistic__suffix">{suffix}</span>}
        </span>
      </div>
    </div>
  );
}

Statistic.Countdown = Countdown;
