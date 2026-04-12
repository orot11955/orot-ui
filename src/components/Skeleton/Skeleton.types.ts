import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  active?: boolean;
  loading?: boolean;
  avatar?: boolean | { size?: number | 'sm' | 'md' | 'lg'; shape?: 'circle' | 'square' };
  title?: boolean | { width?: string | number };
  paragraph?: boolean | { rows?: number; width?: (string | number)[] | string | number };
  round?: boolean;
}

export interface SkeletonElementProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  size?: number | 'sm' | 'md' | 'lg';
  block?: boolean;
}

export interface SkeletonAvatarProps extends SkeletonElementProps {
  shape?: 'circle' | 'square';
}

export interface SkeletonButtonProps extends SkeletonElementProps {
  shape?: 'default' | 'round' | 'circle';
}

export interface SkeletonImageProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  width?: number | string;
  height?: number | string;
}
