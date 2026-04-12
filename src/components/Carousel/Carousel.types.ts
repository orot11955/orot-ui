import type { ReactNode } from 'react';

export type CarouselEffect = 'scrollx' | 'fade';
export type CarouselDotPosition = 'top' | 'bottom' | 'left' | 'right';

export interface CarouselProps {
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean | { className?: string };
  dotPosition?: CarouselDotPosition;
  effect?: CarouselEffect;
  infinite?: boolean;
  speed?: number;
  arrows?: boolean;
  defaultActiveIndex?: number;
  activeIndex?: number;
  beforeChange?: (from: number, to: number) => void;
  afterChange?: (current: number) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
