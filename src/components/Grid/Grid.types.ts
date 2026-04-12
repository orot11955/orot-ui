import type { HTMLAttributes } from 'react';
import type { Breakpoint } from '../../utils/breakpoints';

export type RowJustify =
  | 'start' | 'end' | 'center'
  | 'space-around' | 'space-between' | 'space-evenly';

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch';
export type ResponsiveNumber = number | Partial<Record<Breakpoint, number>>;
export type RowGutter = ResponsiveNumber;

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gutter?: RowGutter | [RowGutter, RowGutter];
  justify?: RowJustify;
  align?: RowAlign;
  wrap?: boolean;
}

export interface ColResponsiveConfig {
  span?: number;
  offset?: number;
  order?: number;
  flex?: string | number;
}

export type ColResponsive = number | ColResponsiveConfig;

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  span?: number;
  offset?: number;
  order?: number;
  flex?: string | number;
  xs?: ColResponsive;
  sm?: ColResponsive;
  md?: ColResponsive;
  lg?: ColResponsive;
  xl?: ColResponsive;
  xxl?: ColResponsive;
}
