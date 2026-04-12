import type { HTMLAttributes, ReactNode } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerLabelPosition = 'left' | 'center' | 'right';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** 방향. 기본값 'horizontal' */
  type?: DividerOrientation;
  /** orientation은 type의 alias */
  orientation?: DividerOrientation;
  dashed?: boolean;
  /** 구분선 텍스트 레이블 (children 우선, label은 하위 호환용) */
  label?: ReactNode;
  /** label의 alias */
  labelPosition?: DividerLabelPosition;
  /** titlePlacement는 labelPosition의 alias */
  titlePlacement?: DividerLabelPosition;
  plain?: boolean;
  orientationMargin?: string | number;
}
