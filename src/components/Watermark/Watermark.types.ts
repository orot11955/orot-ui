import type { ReactNode } from 'react';

export interface WatermarkFont {
  color?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'light' | 'weight' | number;
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
  fontFamily?: string;
}

export interface WatermarkProps {
  content?: string | string[];
  image?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  gap?: [number, number];
  offset?: [number, number];
  font?: WatermarkFont;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
