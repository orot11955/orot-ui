import type { HTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';

export type TypographyType = 'secondary' | 'success' | 'warning' | 'danger';

interface TypographyBaseProps {
  type?: TypographyType;
  disabled?: boolean;
  ellipsis?: boolean;
  className?: string;
}

export interface TitleProps
  extends TypographyBaseProps,
    HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TextProps
  extends TypographyBaseProps,
    HTMLAttributes<HTMLSpanElement> {
  code?: boolean;
  mark?: boolean;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  children?: ReactNode;
}

export interface ParagraphProps
  extends TypographyBaseProps,
    HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export interface LinkProps
  extends TypographyBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'> {
  external?: boolean;
  children?: ReactNode;
}
