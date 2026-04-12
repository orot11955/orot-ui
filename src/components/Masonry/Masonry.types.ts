import type { CSSProperties, ReactNode } from 'react';

export interface MasonryProps {
  children: ReactNode;
  /** 열 개수 (숫자 고정) 또는 반응형 객체 */
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** 아이템 사이 간격 (px) */
  gap?: number;
  className?: string;
  style?: CSSProperties;
}
