import type { CSSProperties, ReactNode } from 'react';

export interface DescriptionsItem {
  key?: string;
  label: ReactNode;
  children: ReactNode;
  /** 차지할 열 수 */
  span?: number;
}

export type DescriptionsSize = 'sm' | 'md' | 'lg';
export type DescriptionsLayout = 'horizontal' | 'vertical';

export interface DescriptionsProps {
  items: DescriptionsItem[];
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  /** 한 행에 표시할 열 수 */
  column?: number;
  size?: DescriptionsSize;
  layout?: DescriptionsLayout;
  className?: string;
  style?: CSSProperties;
}
