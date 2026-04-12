import { useState } from 'react';
import './Checkbox.css';
import type { CheckboxProps, CheckboxGroupProps } from './Checkbox.types';

function CheckboxRoot({
  checked: controlledChecked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  children,
  onChange,
  className = '',
  style,
  ...rest
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? internalChecked;

  const cls = [
    'orot-checkbox',
    checked && 'orot-checkbox--checked',
    indeterminate && 'orot-checkbox--indeterminate',
    disabled && 'orot-checkbox--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledChecked === undefined) setInternalChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label className={cls} style={style}>
      <input
        type="checkbox"
        className="orot-checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      <span className="orot-checkbox__box" />
      {children && <span className="orot-checkbox__label">{children}</span>}
    </label>
  );
}

function CheckboxGroup({
  options,
  value: controlledValue,
  defaultValue = [],
  disabled = false,
  onChange,
  className = '',
  style,
}: CheckboxGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const value = controlledValue ?? internalValue;

  const handleChange = (optVal: string, checked: boolean) => {
    const next = checked ? [...value, optVal] : value.filter((v) => v !== optVal);
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div className={['orot-checkbox-group', className].filter(Boolean).join(' ')} style={style}>
      {options.map((opt) => (
        <CheckboxRoot
          key={opt.value}
          checked={value.includes(opt.value)}
          disabled={disabled || opt.disabled}
          onChange={(checked) => handleChange(opt.value, checked)}
        >
          {opt.label}
        </CheckboxRoot>
      ))}
    </div>
  );
}

export const Checkbox = Object.assign(CheckboxRoot, { Group: CheckboxGroup });
