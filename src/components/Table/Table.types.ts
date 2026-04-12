import type { HTMLAttributes, ReactNode } from 'react';

export type SortOrder = 'asc' | 'desc' | null;
export interface TablePaginationConfig {
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  hideOnSinglePage?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, pageSize: number) => void;
}

export interface ColumnType<T = Record<string, unknown>> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  sortOrder?: SortOrder;
  defaultSortOrder?: Exclude<SortOrder, null>;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
}

export interface TableProps<T = Record<string, unknown>> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  columns: ColumnType<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  loading?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md';
  scroll?: { x?: number | string; y?: number | string };
  pagination?: false | TablePaginationConfig;
  rowSelection?: {
    selectedRowKeys?: string[];
    defaultSelectedRowKeys?: string[];
    onChange?: (keys: string[], rows: T[]) => void;
  };
  locale?: {
    emptyText?: ReactNode;
  };
  rowClassName?: string | ((record: T, index: number) => string);
  onChange?: (
    pagination: { current: number; pageSize: number; total: number },
    filters: Record<string, never>,
    sorter: { columnKey?: string; order: SortOrder; column?: ColumnType<T> },
  ) => void;
  emptyText?: ReactNode;
}
