import { useState } from 'react';
import './Tag.css';
import type { TagCheckableProps, TagProps } from './Tag.types';

const SEMANTIC_COLORS = ['default', 'success', 'warning', 'error', 'info'];

function TagRoot({
  color = 'default',
  closable = false,
  bordered = false,
  icon,
  onClose,
  children,
  className = '',
  style,
  ...rest
}: TagProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isSemantic = SEMANTIC_COLORS.includes(color);

  const cls = [
    'orot-tag',
    isSemantic && color !== 'default' && `orot-tag--${color}`,
    bordered && 'orot-tag--bordered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle =
    !isSemantic
      ? {
          backgroundColor: `${color}1a`,
          color,
          borderColor: closable || bordered ? color : 'transparent',
          ...style,
        }
      : style;

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <span className={cls} style={customStyle} {...rest}>
      {icon && <span className="orot-tag__icon">{icon}</span>}
      <span className="orot-tag__label">{children}</span>
      {closable && (
        <button type="button" className="orot-tag__close" onClick={handleClose} aria-label="remove">
          ✕
        </button>
      )}
    </span>
  );
}

function CheckableTag({
  checked: controlledChecked,
  defaultChecked = false,
  icon,
  onChange,
  children,
  className = '',
  ...rest
}: TagCheckableProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? internalChecked;

  const handleToggle = () => {
    const nextChecked = !checked;
    if (controlledChecked === undefined) {
      setInternalChecked(nextChecked);
    }
    onChange?.(nextChecked);
  };

  return (
    <button
      type="button"
      className={[
        'orot-tag',
        'orot-tag--checkable',
        checked && 'orot-tag--checked',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={checked}
      onClick={handleToggle}
      {...rest}
    >
      {icon && <span className="orot-tag__icon">{icon}</span>}
      <span className="orot-tag__label">{children}</span>
    </button>
  );
}

export const Tag = Object.assign(TagRoot, { CheckableTag });
