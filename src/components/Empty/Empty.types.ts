import type { CSSProperties, ReactNode } from 'react';

export interface EmptyProps {
  image?: ReactNode | 'default' | 'simple';
  imageStyle?: CSSProperties;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
