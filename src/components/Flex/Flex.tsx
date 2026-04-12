import type { CSSProperties } from 'react';
import './Flex.css';
import type { FlexProps } from './Flex.types';

const GAP_MAP = {
  sm: 'var(--orot-space-2)',
  md: 'var(--orot-space-4)',
  lg: 'var(--orot-space-6)',
};

function resolveWrap(wrap: FlexProps['wrap']): string | undefined {
  if (wrap === true)             return 'wrap';
  if (wrap === false)            return 'nowrap';
  if (typeof wrap === 'string') return wrap;
  return undefined;
}

export function Flex({
  vertical = false,
  justify,
  align,
  gap,
  wrap,
  flex,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}: FlexProps) {
  const wrapValue = resolveWrap(wrap);
  const cls = [
    'orot-flex',
    vertical && 'orot-flex--vertical',
    (wrapValue === 'wrap' || wrapValue === 'wrap-reverse') && 'orot-flex--wrap',
    justify && `orot-flex--justify-${justify}`,
    align && `orot-flex--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const gapValue =
    gap === undefined
      ? undefined
      : typeof gap === 'number'
      ? `${gap}px`
      : GAP_MAP[gap];

  const cssVars: CSSProperties = {
    ...(gapValue !== undefined && ({ '--flex-gap': gapValue } as CSSProperties)),
    ...(flex !== undefined && { flex }),
    ...(wrapValue && { flexWrap: wrapValue as CSSProperties['flexWrap'] }),
  };

  return (
    <Tag className={cls} style={{ ...cssVars, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
