import { Children, Fragment, type CSSProperties } from 'react';
import './Space.css';
import type { SpaceProps } from './Space.types';

const SIZE_MAP = {
  sm: 'var(--orot-space-2)',
  md: 'var(--orot-space-4)',
  lg: 'var(--orot-space-6)',
};

export function Space({
  direction = 'horizontal',
  size = 'sm',
  align,
  wrap = false,
  split,
  block = false,
  className = '',
  style,
  children,
  ...rest
}: SpaceProps) {
  const gapValue =
    typeof size === 'number' ? `${size}px` : SIZE_MAP[size];

  const cls = [
    'orot-space',
    `orot-space--${direction}`,
    wrap && 'orot-space--wrap',
    block && 'orot-space--block',
    align && `orot-space--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cssVars = { '--space-gap': gapValue } as CSSProperties;

  const items = Children.toArray(children).filter((c) => c !== null && c !== undefined);

  return (
    <div className={cls} style={{ ...cssVars, ...style }} {...rest}>
      {items.map((child, i) => (
        <Fragment key={i}>
          <span className="orot-space__item">{child}</span>
          {split && i < items.length - 1 && (
            <span className="orot-space__split" aria-hidden="true">
              {split}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
