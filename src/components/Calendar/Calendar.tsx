import { useState } from 'react';
import './Calendar.css';
import type { CalendarMode, CalendarProps } from './Calendar.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function Calendar({
  value: controlledValue,
  defaultValue,
  mode: controlledMode,
  fullscreen = true,
  disabledDate,
  dateCellRender,
  monthCellRender,
  onSelect,
  onChange,
  onPanelChange,
  className = '',
  style,
}: CalendarProps) {
  const today = new Date();
  const [internalValue, setInternalValue] = useState<Date>(defaultValue ?? today);
  const [internalMode, setInternalMode] = useState<CalendarMode>('month');
  const [viewing, setViewing] = useState<Date>(defaultValue ?? today);

  const value = controlledValue ?? internalValue;
  const mode = controlledMode ?? internalMode;

  const setValue = (date: Date, source: 'date' | 'month' | 'year') => {
    if (controlledValue === undefined) setInternalValue(date);
    onChange?.(date);
    onSelect?.(date, { source });
  };

  const changeMode = (next: CalendarMode) => {
    if (controlledMode === undefined) setInternalMode(next);
    onPanelChange?.(viewing, next);
  };

  const prevYear = () => {
    const d = new Date(viewing.getFullYear() - 1, viewing.getMonth(), 1);
    setViewing(d);
    onPanelChange?.(d, mode);
  };

  const nextYear = () => {
    const d = new Date(viewing.getFullYear() + 1, viewing.getMonth(), 1);
    setViewing(d);
    onPanelChange?.(d, mode);
  };

  const prevMonth = () => {
    const d = new Date(viewing.getFullYear(), viewing.getMonth() - 1, 1);
    setViewing(d);
    onPanelChange?.(d, mode);
  };

  const nextMonth = () => {
    const d = new Date(viewing.getFullYear(), viewing.getMonth() + 1, 1);
    setViewing(d);
    onPanelChange?.(d, mode);
  };

  const year = viewing.getFullYear();
  const month = viewing.getMonth();

  const renderMonthMode = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    // Always pad to 42 cells (6 rows × 7 cols) so calendar height is stable
    while (cells.length < 42) cells.push(null);

    return (
      <>
        <div className="orot-calendar__day-headers">
          {DAYS.map(d => <div key={d} className="orot-calendar__day-name">{d}</div>)}
        </div>
        <div className="orot-calendar__month-grid">
          {cells.map((date, i) => {
            if (!date) return <div key={`e-${i}`} className="orot-calendar__cell orot-calendar__cell--empty" />;
            const isSelected = isSameDay(date, value);
            const isToday = isSameDay(date, today);
            const isDisabled = disabledDate?.(date) ?? false;
            return (
              <div
                key={date.getDate()}
                className={[
                  'orot-calendar__cell',
                  isSelected && 'orot-calendar__cell--selected',
                  isToday && 'orot-calendar__cell--today',
                  isDisabled && 'orot-calendar__cell--disabled',
                  !fullscreen && 'orot-calendar__cell--mini',
                ].filter(Boolean).join(' ')}
                onClick={() => !isDisabled && setValue(date, 'date')}
              >
                <div className="orot-calendar__date-value">{date.getDate()}</div>
                {dateCellRender && !fullscreen && (
                  <div className="orot-calendar__date-content">{dateCellRender(date)}</div>
                )}
                {dateCellRender && fullscreen && (
                  <div className="orot-calendar__date-content">{dateCellRender(date)}</div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderYearMode = () => {
    return (
      <div className="orot-calendar__year-grid">
        {MONTHS.map((name, idx) => {
          const date = new Date(year, idx, 1);
          const isSelected = value.getFullYear() === year && value.getMonth() === idx;
          const isDisabled = disabledDate?.(date) ?? false;
          return (
            <div
              key={name}
              className={[
                'orot-calendar__month-cell',
                isSelected && 'orot-calendar__month-cell--selected',
                isDisabled && 'orot-calendar__month-cell--disabled',
              ].filter(Boolean).join(' ')}
              onClick={() => !isDisabled && setValue(date, 'month')}
            >
              <div className="orot-calendar__month-value">{name}</div>
              {monthCellRender && <div className="orot-calendar__month-content">{monthCellRender(date)}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={[
        'orot-calendar',
        fullscreen && 'orot-calendar--fullscreen',
        !fullscreen && 'orot-calendar--mini',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="orot-calendar__header">
        <div className="orot-calendar__nav">
          <button type="button" className="orot-calendar__nav-btn" onClick={prevYear} title="Previous year">«</button>
          {mode === 'month' && (
            <button type="button" className="orot-calendar__nav-btn" onClick={prevMonth} title="Previous month">‹</button>
          )}
        </div>

        <div className="orot-calendar__header-center">
          <span className="orot-calendar__header-year">{year}년</span>
          {mode === 'month' && <span className="orot-calendar__header-month">{MONTH_FULL[month]}</span>}
        </div>

        <div className="orot-calendar__mode-toggle">
          <button
            type="button"
            className={['orot-calendar__mode-btn', mode === 'month' && 'orot-calendar__mode-btn--active'].filter(Boolean).join(' ')}
            onClick={() => changeMode('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={['orot-calendar__mode-btn', mode === 'year' && 'orot-calendar__mode-btn--active'].filter(Boolean).join(' ')}
            onClick={() => changeMode('year')}
          >
            Year
          </button>
        </div>

        <div className="orot-calendar__nav">
          {mode === 'month' && (
            <button type="button" className="orot-calendar__nav-btn" onClick={nextMonth} title="Next month">›</button>
          )}
          <button type="button" className="orot-calendar__nav-btn" onClick={nextYear} title="Next year">»</button>
        </div>
      </div>

      <div className="orot-calendar__body">
        {mode === 'month' ? renderMonthMode() : renderYearMode()}
      </div>
    </div>
  );
}
