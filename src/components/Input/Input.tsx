import { useState, useRef } from 'react';
import './Input.css';
import type { InputProps } from './Input.types';

export function Input({
  size = 'md',
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  allowClear = false,
  showCount = false,
  status,
  disabled,
  maxLength,
  value: controlledValue,
  defaultValue = '',
  onChange,
  className = '',
  style,
  ...rest
}: InputProps) {
  const [internalValue, setInternalValue] = useState<string>(
    typeof defaultValue === 'string' ? defaultValue : String(defaultValue),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const value =
    controlledValue !== undefined ? String(controlledValue) : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    if (controlledValue === undefined) setInternalValue('');
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, '');
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
    inputRef.current?.focus();
  };

  const affixCls = [
    'orot-input-affix',
    `orot-input-affix--${size}`,
    status && `orot-input-affix--${status}`,
    disabled && 'orot-input-affix--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperCls = [
    'orot-input-wrapper',
    showCount && 'orot-input-wrapper--count',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const showClear = allowClear && value && !disabled;

  const countLabel = showCount
    ? maxLength !== undefined
      ? `${value.length} / ${maxLength}`
      : `${value.length}`
    : null;

  return (
    <span className={wrapperCls} style={style}>
      {addonBefore && (
        <span className="orot-input__addon orot-input__addon-before">
          {addonBefore}
        </span>
      )}
      <span className={affixCls}>
        {prefix && <span className="orot-input__prefix">{prefix}</span>}
        <input
          ref={inputRef}
          className="orot-input"
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            className="orot-input__clear"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="clear"
          >
            ✕
          </button>
        )}
        {suffix && <span className="orot-input__suffix">{suffix}</span>}
        {countLabel !== null && (
          <span className="orot-input__count" aria-live="polite">
            {countLabel}
          </span>
        )}
      </span>
      {addonAfter && (
        <span className="orot-input__addon orot-input__addon-after">
          {addonAfter}
        </span>
      )}
    </span>
  );
}
