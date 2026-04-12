import { useState } from 'react';
import './Rate.css';
import type { RateProps } from './Rate.types';

const StarIcon = ({ filled, half }: { filled: boolean; half: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="orot-rate__star-svg">
    {half ? (
      <>
        <defs>
          <linearGradient id="orot-rate-half">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#orot-rate-half)"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

export function Rate({
  count = 5,
  value: controlledValue,
  defaultValue = 0,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  tooltips,
  character,
  onChange,
  onHoverChange,
  className = '',
  style,
}: RateProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const update = (next: number) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    if (disabled) return;
    if (allowHalf) {
      const rect = (e.currentTarget as HTMLSpanElement).getBoundingClientRect();
      const isLeft = e.clientX - rect.left < rect.width / 2;
      const next = isLeft ? index + 0.5 : index + 1;
      setHoverValue(next);
      onHoverChange?.(next);
    } else {
      setHoverValue(index + 1);
      onHoverChange?.(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverValue(null);
    onHoverChange?.(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    if (disabled) return;
    let next: number;
    if (allowHalf) {
      const rect = (e.currentTarget as HTMLSpanElement).getBoundingClientRect();
      const isLeft = e.clientX - rect.left < rect.width / 2;
      next = isLeft ? index + 0.5 : index + 1;
    } else {
      next = index + 1;
    }
    if (allowClear && next === value) next = 0;
    update(next);
  };

  const renderChar = (index: number) => {
    if (!character) {
      const filled = displayValue >= index + 1;
      const half = !filled && allowHalf && displayValue >= index + 0.5;
      return <StarIcon filled={filled} half={half} />;
    }
    return typeof character === 'function' ? character(index) : character;
  };

  const cls = [
    'orot-rate',
    disabled && 'orot-rate--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={cls}
      style={style}
      role="radiogroup"
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: count }, (_, i) => {
        const isFilled = displayValue >= i + 1;
        const isHalfFilled = !isFilled && allowHalf && displayValue >= i + 0.5;
        const title = tooltips?.[i];

        return (
          <span
            key={i}
            className={[
              'orot-rate__item',
              isFilled && 'orot-rate__item--filled',
              isHalfFilled && 'orot-rate__item--half',
            ].filter(Boolean).join(' ')}
            title={title}
            role="radio"
            aria-checked={Math.ceil(displayValue) === i + 1}
            aria-label={title ?? `${i + 1} star`}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onClick={(e) => handleClick(e, i)}
          >
            {renderChar(i)}
          </span>
        );
      })}
    </span>
  );
}
