import { useState, useRef } from 'react';
import './InputNumber.css';
import type { InputNumberProps } from './InputNumber.types';

export function InputNumber({
  value: controlledValue,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  disabled = false,
  readOnly = false,
  status,
  size = 'md',
  placeholder,
  prefix,
  addonBefore,
  addonAfter,
  formatter,
  parser,
  onChange,
  onStep,
  className = '',
  style,
  controls = true,
  keyboard = true,
}: InputNumberProps) {
  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue ?? null,
  );
  const [inputStr, setInputStr] = useState<string>('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const clamp = (v: number): number => {
    let result = v;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  };

  const applyPrecision = (v: number): number => {
    if (precision !== undefined) {
      return parseFloat(v.toFixed(precision));
    }
    return v;
  };

  const getDisplayValue = (): string => {
    if (focused) return inputStr;
    if (value === null || value === undefined) return '';
    const formatted = applyPrecision(value);
    return formatter ? formatter(formatted) : String(formatted);
  };

  const commitValue = (str: string) => {
    const parsed = parser ? parser(str) : parseFloat(str);
    if (str === '' || isNaN(parsed)) {
      setInternalValue(null);
      onChange?.(null);
    } else {
      const clamped = applyPrecision(clamp(parsed));
      setInternalValue(clamped);
      onChange?.(clamped);
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setInputStr(value !== null && value !== undefined ? String(applyPrecision(value)) : '');
  };

  const handleBlur = () => {
    setFocused(false);
    commitValue(inputStr);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value);
  };

  const stepValue = (direction: 'up' | 'down') => {
    const current = value ?? 0;
    const next = applyPrecision(clamp(current + (direction === 'up' ? step : -step)));
    if (controlledValue === undefined) setInternalValue(next);
    setInputStr(String(next));
    onChange?.(next);
    onStep?.(next, { offset: step, type: direction });
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!keyboard) return;
    if (e.key === 'ArrowUp') { e.preventDefault(); stepValue('up'); }
    if (e.key === 'ArrowDown') { e.preventDefault(); stepValue('down'); }
  };

  const upDisabled = disabled || (max !== undefined && (value ?? 0) >= max);
  const downDisabled = disabled || (min !== undefined && (value ?? 0) <= min);

  const affixCls = [
    'orot-input-number__affix',
    `orot-input-number__affix--${size}`,
    status && `orot-input-number__affix--${status}`,
    disabled && 'orot-input-number__affix--disabled',
    focused && 'orot-input-number__affix--focused',
  ].filter(Boolean).join(' ');

  const wrapperCls = [
    'orot-input-number-wrapper',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={wrapperCls} style={style}>
      {addonBefore && (
        <span className="orot-input-number__addon orot-input-number__addon-before">
          {addonBefore}
        </span>
      )}
      <span className={affixCls}>
        {prefix && <span className="orot-input-number__prefix">{prefix}</span>}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          className="orot-input-number__input"
          value={getDisplayValue()}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {controls && (
          <span className="orot-input-number__controls">
            <button
              type="button"
              className="orot-input-number__step orot-input-number__step-up"
              disabled={upDisabled}
              onMouseDown={(e) => { e.preventDefault(); stepValue('up'); }}
              tabIndex={-1}
              aria-label="increase"
            >
              ▲
            </button>
            <button
              type="button"
              className="orot-input-number__step orot-input-number__step-down"
              disabled={downDisabled}
              onMouseDown={(e) => { e.preventDefault(); stepValue('down'); }}
              tabIndex={-1}
              aria-label="decrease"
            >
              ▼
            </button>
          </span>
        )}
      </span>
      {addonAfter && (
        <span className="orot-input-number__addon orot-input-number__addon-after">
          {addonAfter}
        </span>
      )}
    </span>
  );
}
