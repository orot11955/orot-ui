import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './DatePicker.css';
import type { DatePickerProps, RangePickerProps } from './DatePicker.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatDate(date: Date | null, fmt?: string): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  if (fmt) return fmt.replace('YYYY', String(y)).replace('MM', m).replace('DD', d);
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function CalendarPanel({
  viewing,
  selected,
  disabledDate,
  onSelect,
  onViewingChange,
}: {
  viewing: Date;
  selected: Date | null;
  disabledDate?: (d: Date) => boolean;
  onSelect: (d: Date) => void;
  onViewingChange: (d: Date) => void;
}) {
  const year = viewing.getFullYear();
  const month = viewing.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const prevMonth = () => onViewingChange(new Date(year, month - 1, 1));
  const nextMonth = () => onViewingChange(new Date(year, month + 1, 1));

  return (
    <div className="orot-datepicker__panel">
      <div className="orot-datepicker__panel-header">
        <button type="button" className="orot-datepicker__nav" onClick={prevMonth}>‹</button>
        <span className="orot-datepicker__panel-title">{MONTHS[month]} {year}</span>
        <button type="button" className="orot-datepicker__nav" onClick={nextMonth}>›</button>
      </div>
      <div className="orot-datepicker__days-header">
        {DAYS.map(d => <span key={d} className="orot-datepicker__day-name">{d}</span>)}
      </div>
      <div className="orot-datepicker__days-grid">
        {cells.map((date, i) => {
          if (!date) return <span key={`e-${i}`} />;
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);
          const isDisabled = disabledDate?.(date) ?? false;
          return (
            <button
              key={date.getDate()}
              type="button"
              disabled={isDisabled}
              className={[
                'orot-datepicker__cell',
                isSelected && 'orot-datepicker__cell--selected',
                isToday && 'orot-datepicker__cell--today',
                isDisabled && 'orot-datepicker__cell--disabled',
              ].filter(Boolean).join(' ')}
              onClick={() => !isDisabled && onSelect(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DatePicker({
  value: controlledValue,
  defaultValue = null,
  disabled = false,
  allowClear = true,
  showToday = true,
  status,
  size = 'md',
  placeholder = 'Select date',
  disabledDate,
  onChange,
  onOpenChange,
  className = '',
  style,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(new Date());
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

  const handleSelect = (date: Date) => {
    if (controlledValue === undefined) setInternalValue(date);
    onChange?.(date, formatDate(date));
    setDropdownOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) setInternalValue(null);
    onChange?.(null, '');
  };

  const displayText = formatDate(value);

  return (
    <div
      ref={containerRef}
      className={[
        'orot-datepicker',
        `orot-datepicker--${size}`,
        status && `orot-datepicker--${status}`,
        disabled && 'orot-datepicker--disabled',
        open && 'orot-datepicker--open',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div
        className="orot-datepicker__selector"
        onClick={() => !disabled && setDropdownOpen(!open)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDropdownOpen(!open); } if (e.key === 'Escape') setDropdownOpen(false); }}
      >
        <span className={displayText ? 'orot-datepicker__value' : 'orot-datepicker__placeholder'}>
          {displayText || placeholder}
        </span>
        <span className="orot-datepicker__icons">
          {allowClear && value && !disabled && (
            <button type="button" className="orot-datepicker__clear" onClick={handleClear} tabIndex={-1}>✕</button>
          )}
          <span className="orot-datepicker__icon">📅</span>
        </span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
          <div
            ref={dropdownRef}
            className="orot-datepicker__dropdown"
            style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
          >
            <CalendarPanel
              viewing={viewing}
              selected={value}
              disabledDate={disabledDate}
              onSelect={handleSelect}
              onViewingChange={setViewing}
            />
            {showToday && (
              <div className="orot-datepicker__footer">
                <button type="button" className="orot-datepicker__today-btn" onClick={() => handleSelect(new Date())}>
                  Today
                </button>
              </div>
            )}
          </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}

function RangePicker({
  value: controlledValue,
  defaultValue = [null, null],
  disabled = false,
  allowClear = true,
  status,
  size = 'md',
  placeholder = ['Start date', 'End date'],
  disabledDate,
  onChange,
  className = '',
  style,
}: RangePickerProps) {
  const [internalValue, setInternalValue] = useState<[Date | null, Date | null]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<0 | 1>(0);
  const [viewing, setViewing] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const value = controlledValue ?? internalValue;

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
        setOpen(false);
        setPos(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (date: Date) => {
    const next: [Date | null, Date | null] = [...value] as [Date | null, Date | null];
    next[selecting] = date;
    if (selecting === 0) {
      next[1] = null;
      setSelecting(1);
    } else {
      if (next[0] && date < next[0]) { next[0] = date; next[1] = value[0]; }
      setOpen(false);
      setSelecting(0);
    }
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next, [formatDate(next[0]), formatDate(next[1])]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const empty: [Date | null, Date | null] = [null, null];
    if (controlledValue === undefined) setInternalValue(empty);
    onChange?.(empty, ['', '']);
  };

  return (
    <div
      ref={containerRef}
      className={[
        'orot-datepicker orot-datepicker--range',
        `orot-datepicker--${size}`,
        status && `orot-datepicker--${status}`,
        (disabled === true) && 'orot-datepicker--disabled',
        open && 'orot-datepicker--open',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="orot-datepicker__selector" onClick={() => !(disabled === true) && setOpen(!open)}>
        <span className={value[0] ? 'orot-datepicker__value' : 'orot-datepicker__placeholder'}>
          {formatDate(value[0]) || placeholder[0]}
        </span>
        <span className="orot-datepicker__range-sep">→</span>
        <span className={value[1] ? 'orot-datepicker__value' : 'orot-datepicker__placeholder'}>
          {formatDate(value[1]) || placeholder[1]}
        </span>
        <span className="orot-datepicker__icons">
          {allowClear && (value[0] || value[1]) && !(disabled === true) && (
            <button type="button" className="orot-datepicker__clear" onClick={handleClear} tabIndex={-1}>✕</button>
          )}
          <span className="orot-datepicker__icon">📅</span>
        </span>
      </div>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
          <div
            ref={dropdownRef}
            className="orot-datepicker__dropdown"
            style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
          >
            <CalendarPanel
              viewing={viewing}
              selected={value[selecting]}
              disabledDate={disabledDate}
              onSelect={handleSelect}
              onViewingChange={setViewing}
            />
          </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}

DatePicker.RangePicker = RangePicker;
