import { useState, createContext, useContext } from 'react';
import './Radio.css';
import type { RadioProps, RadioGroupProps } from './Radio.types';

interface RadioContextValue {
  value?: string | number;
  disabled?: boolean;
  name?: string;
  optionType?: 'default' | 'button';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  onChange?: (value: string | number) => void;
}

const RadioContext = createContext<RadioContextValue>({});

function RadioRoot({
  checked: controlledChecked,
  defaultChecked = false,
  disabled,
  value,
  children,
  onChange,
  className = '',
  style,
  ...rest
}: RadioProps) {
  const ctx = useContext(RadioContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlledByGroup = ctx.value !== undefined || ctx.onChange !== undefined;
  const checked = isControlledByGroup
    ? ctx.value === value
    : (controlledChecked ?? internalChecked);

  const isDisabled = disabled ?? ctx.disabled ?? false;

  const cls = [
    'orot-radio',
    ctx.optionType === 'button' && 'orot-radio--button',
    ctx.size && `orot-radio--${ctx.size}`,
    ctx.block && 'orot-radio--block',
    checked && 'orot-radio--checked',
    isDisabled && 'orot-radio--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = () => {
    if (isDisabled) return;
    if (isControlledByGroup) {
      value !== undefined && ctx.onChange?.(value);
    } else {
      if (controlledChecked === undefined) setInternalChecked(true);
      value !== undefined && onChange?.(value);
    }
  };

  return (
    <label className={cls} style={style}>
      <input
        type="radio"
        className="orot-radio__input"
        checked={checked}
        disabled={isDisabled}
        name={ctx.name}
        onChange={handleChange}
        {...rest}
      />
      <span className="orot-radio__circle" />
      {children && <span className="orot-radio__label">{children}</span>}
    </label>
  );
}

function RadioGroup({
  options,
  value: controlledValue,
  defaultValue,
  disabled = false,
  buttonStyle,
  optionType,
  size = 'md',
  block = false,
  onChange,
  children,
  className = '',
  style,
  name,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const value = controlledValue ?? internalValue;
  const resolvedOptionType = optionType ?? (buttonStyle ? 'button' : 'default');

  const handleChange = (val: string | number) => {
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);
  };

  const cls = [
    'orot-radio-group',
    resolvedOptionType === 'button' && 'orot-radio-group--button',
    resolvedOptionType === 'button' && buttonStyle && `orot-radio-group--button-${buttonStyle}`,
    `orot-radio-group--${size}`,
    block && 'orot-radio-group--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <RadioContext.Provider
      value={{
        value,
        disabled,
        name,
        optionType: resolvedOptionType,
        size,
        block,
        onChange: handleChange,
      }}
    >
      <div className={cls} style={style} role="radiogroup">
        {options
          ? options.map((opt) => (
              <RadioRoot key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </RadioRoot>
            ))
          : children}
      </div>
    </RadioContext.Provider>
  );
}

export const Radio = Object.assign(RadioRoot, { Group: RadioGroup });
