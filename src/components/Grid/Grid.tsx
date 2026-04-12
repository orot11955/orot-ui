import type { CSSProperties } from 'react';
import './Grid.css';
import type { Breakpoint } from '../../utils/breakpoints';
import type { RowProps, ColProps, ColResponsive, RowGutter } from './Grid.types';

const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

function resolveResponsiveNumber(value?: RowGutter): Partial<Record<Breakpoint, number>> {
  if (value === undefined) return {};
  if (typeof value === 'number') return { xs: value };
  return value;
}

function createResponsiveNumberVars(prefix: string, value?: RowGutter): CSSProperties {
  const resolved = resolveResponsiveNumber(value);
  return Object.fromEntries(
    Object.entries(resolved).map(([breakpoint, currentValue]) => {
      const suffix = breakpoint === 'xs' ? '' : `-${breakpoint}`;
      return [`--${prefix}${suffix}`, `${currentValue}px`];
    }),
  ) as CSSProperties;
}

/* ── Row ─────────────────────────────────────────────── */
export function Row({
  gutter,
  justify,
  align,
  wrap = true,
  className = '',
  style,
  children,
  ...rest
}: RowProps) {
  const gutterX = Array.isArray(gutter) ? gutter[0] : gutter;
  const gutterY = Array.isArray(gutter) ? gutter[1] : 0;

  const cssVars: CSSProperties = {
    ...createResponsiveNumberVars('row-gutter-x', gutterX),
    ...createResponsiveNumberVars('row-gutter-y', gutterY),
  };

  const cls = [
    'orot-row',
    !wrap && 'orot-row--nowrap',
    justify && `orot-row--justify-${justify}`,
    align && `orot-row--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={{ ...cssVars, ...style }} {...rest}>
      {children}
    </div>
  );
}

/* ── Col ─────────────────────────────────────────────── */
function resolveResponsive(val: ColResponsive | undefined): {
  span?: number;
  offset?: number;
  order?: number;
  flex?: string | number;
} {
  if (val === undefined) return {};
  if (typeof val === 'number') return { span: val };
  return val;
}

export function Col({
  span,
  offset,
  order,
  flex,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  className = '',
  style,
  children,
  ...rest
}: ColProps) {
  const r = {
    xs: resolveResponsive(xs),
    sm: resolveResponsive(sm),
    md: resolveResponsive(md),
    lg: resolveResponsive(lg),
    xl: resolveResponsive(xl),
    xxl: resolveResponsive(xxl),
  };

  const cssVars: Record<string, number | undefined> = {
    '--col-span':   span ?? r.xs.span,
    '--col-offset': offset ?? r.xs.offset,
    '--col-order':  order ?? r.xs.order,
    '--col-sm':         r.sm.span,   '--col-offset-sm':   r.sm.offset,   '--col-order-sm':  r.sm.order,
    '--col-md':         r.md.span,   '--col-offset-md':   r.md.offset,   '--col-order-md':  r.md.order,
    '--col-lg':         r.lg.span,   '--col-offset-lg':   r.lg.offset,   '--col-order-lg':  r.lg.order,
    '--col-xl':         r.xl.span,   '--col-offset-xl':   r.xl.offset,   '--col-order-xl':  r.xl.order,
    '--col-xxl':        r.xxl.span,  '--col-offset-xxl':  r.xxl.offset,  '--col-order-xxl': r.xxl.order,
  };

  // Remove undefined to avoid overriding CSS fallback chains
  const filteredVars = Object.fromEntries(
    Object.entries(cssVars).filter(([, v]) => v !== undefined),
  ) as CSSProperties;

  const responsiveFlexVars = BREAKPOINTS.reduce<Record<string, string>>((accumulator, breakpoint) => {
    const value = breakpoint === 'xs' ? flex ?? r.xs.flex : r[breakpoint].flex;
    if (value === undefined) {
      return accumulator;
    }

    const suffix = breakpoint === 'xs' ? '' : `-${breakpoint}`;
    accumulator[`--col-flex${suffix}`] = String(value);
    accumulator[`--col-max-width${suffix}`] = 'none';
    return accumulator;
  }, {});

  return (
    <div
      className={`orot-col${className ? ` ${className}` : ''}`}
      style={{ ...filteredVars, ...responsiveFlexVars, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Compound export ─────────────────────────────────── */
export const Grid = { Row, Col };
