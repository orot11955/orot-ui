import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { Breakpoint } from '../../utils/breakpoints';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  hasSider?: boolean;
}

export interface SiderProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  breakpoint?: Breakpoint;
  reverseArrow?: boolean;
  zeroWidthTriggerStyle?: CSSProperties;
  theme?: 'light' | 'dark';
  trigger?: ReactNode | null;
  onCollapse?: (collapsed: boolean) => void;
  onBreakpoint?: (broken: boolean) => void;
}

export type HeaderProps = HTMLAttributes<HTMLElement>;
export type ContentProps = HTMLAttributes<HTMLElement>;
export type FooterProps = HTMLAttributes<HTMLElement>;
