import type { ElementType, HTMLAttributes } from 'react';

export type FlexJustify =
  | 'start' | 'end' | 'center'
  | 'space-between' | 'space-around' | 'space-evenly';

export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
export type FlexWrap = boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
export type FlexGap = 'sm' | 'md' | 'lg' | number;

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  vertical?: boolean;
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: FlexGap;
  wrap?: FlexWrap;
  flex?: string | number;
  as?: ElementType;
}
