import type { ReactNode } from 'react';

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'sm' | 'md' | 'lg' | number;

export interface AvatarProps {
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: ReactNode;
  shape?: AvatarShape;
  size?: AvatarSize;
  gap?: number;
  draggable?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  onError?: () => boolean;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AvatarGroupProps {
  children: ReactNode;
  maxCount?: number;
  maxStyle?: React.CSSProperties;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  style?: React.CSSProperties;
}
