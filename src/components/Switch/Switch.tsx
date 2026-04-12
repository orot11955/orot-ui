import { useState } from 'react';
import './Switch.css';
import type { SwitchProps } from './Switch.types';

export function Switch({
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  loading = false,
  size = 'md',
  checkedChildren,
  unCheckedChildren,
  name,
  value = 'true',
  onChange,
  className = '',
  style,
  ...rest
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? internalChecked;

  const toggle = () => {
    if (disabled || loading) return;
    if (controlledChecked === undefined) setInternalChecked(!checked);
    onChange?.(!checked);
  };

  const cls = [
    'orot-switch',
    `orot-switch--${size}`,
    checked && 'orot-switch--checked',
    (disabled || loading) && 'orot-switch--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {name && (
        <input
          type="hidden"
          name={name}
          value={checked ? String(value) : 'false'}
        />
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || loading}
        className={cls}
        style={style}
        onClick={toggle}
        {...rest}
      >
        {(checkedChildren || unCheckedChildren) && (
          <>
            <span className="orot-switch__inner orot-switch__inner-checked">{checkedChildren}</span>
            <span className="orot-switch__inner orot-switch__inner-unchecked">{unCheckedChildren}</span>
          </>
        )}
        <span className="orot-switch__handle">
          {loading && <span className="orot-switch__spinner" />}
        </span>
      </button>
    </>
  );
}
