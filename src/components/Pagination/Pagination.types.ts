import type { HTMLAttributes, ReactNode } from 'react';

export type PaginationAlign = 'start' | 'center' | 'end';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  current?: number;
  defaultCurrent?: number;
  total: number;
  pageSize?: number;
  defaultPageSize?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  simple?: boolean;
  disabled?: boolean;
  /** 페이지가 1개일 때 숨김 */
  hideOnSinglePage?: boolean;
  /** 정렬 위치 */
  align?: PaginationAlign;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}
