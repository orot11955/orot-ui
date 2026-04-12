import { useState } from 'react';
import './Segmented.css';
import type { SegmentedOption, SegmentedProps } from './Segmented.types';

function normalizeOption(opt: string | number | SegmentedOption): SegmentedOption {
  if (typeof opt === 'string' || typeof opt === 'number') {
    return { value: opt, label: String(opt) };
  }
  return opt;
}

export function Segmented({
  options,
  value: controlledValue,
  defaultValue,
  disabled = false,
  size = 'md',
  block = false,
  onChange,
  className = '',
  style,
}: SegmentedProps) {
  const normalized = options.map(normalizeOption);
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? normalized[0]?.value,
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelect = (optVal: string | number) => {
    if (disabled) return;
    if (controlledValue === undefined) setInternalValue(optVal);
    onChange?.(optVal);
  };

  const cls = [
    'orot-segmented',
    `orot-segmented--${size}`,
    disabled && 'orot-segmented--disabled',
    block && 'orot-segmented--block',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style} role="group">
      {normalized.map((opt) => {
        const isSelected = opt.value === value;
        const isDisabled = disabled || opt.disabled;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            className={[
              'orot-segmented__item',
              opt.className,
              isSelected && 'orot-segmented__item--selected',
              isDisabled && 'orot-segmented__item--disabled',
            ].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && handleSelect(opt.value)}
          >
            {opt.icon && <span className="orot-segmented__icon">{opt.icon}</span>}
            {opt.label ?? String(opt.value)}
          </button>
        );
      })}
    </div>
  );
}
