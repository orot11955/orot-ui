import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'solid' | 'outlined' | 'text' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'default' | 'circle' | 'round';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: ReactNode;
  /** 아이콘 위치 */
  iconPlacement?: 'start' | 'end';
  /** iconPlacement의 alias */
  iconPosition?: 'start' | 'end';
  block?: boolean;
  /** 위험 동작 강조 — 적색 계열 스타일 적용 */
  danger?: boolean;
  /** 투명 배경 (ghost) 스타일 */
  ghost?: boolean;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}
