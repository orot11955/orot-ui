import { useEffect, useState } from 'react';
import { Pagination } from '../Pagination';
import './Table.css';
import type { ColumnType, SortOrder, TableProps } from './Table.types';

function getNextSortOrder(order: SortOrder) {
  if (order === 'asc') return 'desc';
  if (order === 'desc') return null;
  return 'asc';
}

export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = 'key' as keyof T,
  loading = false,
  bordered = false,
  size = 'md',
  scroll,
  pagination,
  rowSelection,
  locale,
  rowClassName,
  onChange,
  emptyText = 'No data',
  className = '',
  style,
  ...rest
}: TableProps<T>) {
  const defaultSortedColumn = columns.find((column) => column.defaultSortOrder);
  const controlledSortedColumn = columns.find((column) => column.sortOrder !== undefined);

  const [sortKey, setSortKey] = useState<string | null>(
    controlledSortedColumn?.key ?? defaultSortedColumn?.key ?? null,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    controlledSortedColumn?.sortOrder ?? defaultSortedColumn?.defaultSortOrder ?? null,
  );
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    rowSelection?.selectedRowKeys ?? rowSelection?.defaultSelectedRowKeys ?? [],
  );

  const paginationConfig = pagination || null;
  const [internalCurrent, setInternalCurrent] = useState(
    paginationConfig?.current ?? paginationConfig?.defaultCurrent ?? 1,
  );
  const [internalPageSize, setInternalPageSize] = useState(
    paginationConfig?.pageSize ?? paginationConfig?.defaultPageSize ?? 10,
  );

  useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedKeys(rowSelection.selectedRowKeys);
    }
  }, [rowSelection?.selectedRowKeys]);

  useEffect(() => {
    if (paginationConfig?.current !== undefined) {
      setInternalCurrent(paginationConfig.current);
    }
  }, [paginationConfig?.current]);

  useEffect(() => {
    if (paginationConfig?.pageSize !== undefined) {
      setInternalPageSize(paginationConfig.pageSize);
    }
  }, [paginationConfig?.pageSize]);

  useEffect(() => {
    if (controlledSortedColumn) {
      setSortKey(controlledSortedColumn.key);
      setSortOrder(controlledSortedColumn.sortOrder ?? null);
    }
  }, [controlledSortedColumn]);

  const getKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    return String(record[rowKey] ?? index);
  };

  const currentPage = paginationConfig?.current ?? internalCurrent;
  const pageSize = paginationConfig?.pageSize ?? internalPageSize;

  const activeColumn = columns.find((column) => column.key === sortKey);
  const sortedData = [...dataSource].sort((left, right) => {
    if (!activeColumn || !sortOrder || !activeColumn.sorter) return 0;

    let comparison = 0;
    if (typeof activeColumn.sorter === 'function') {
      comparison = activeColumn.sorter(left, right);
    } else if (activeColumn.dataIndex) {
      const leftValue = left[activeColumn.dataIndex];
      const rightValue = right[activeColumn.dataIndex];
      if (leftValue === rightValue) comparison = 0;
      else comparison = leftValue! < rightValue! ? -1 : 1;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const total = paginationConfig?.total ?? sortedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleData = paginationConfig ? sortedData.slice(startIndex, endIndex) : sortedData;
  const effectiveSelected = rowSelection?.selectedRowKeys ?? selectedKeys;
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  const emitChange = (nextPage = currentPage, nextPageSize = pageSize, nextSortKey = sortKey, nextSortOrder = sortOrder) => {
    const nextColumn = columns.find((column) => column.key === nextSortKey);
    onChange?.(
      {
        current: nextPage,
        pageSize: nextPageSize,
        total,
      },
      {},
      {
        columnKey: nextSortKey ?? undefined,
        order: nextSortOrder,
        column: nextColumn,
      },
    );
  };

  const handleSort = (column: ColumnType<T>) => {
    if (!column.sorter) return;

    const nextKey = column.key;
    const nextOrder = sortKey === column.key ? getNextSortOrder(sortOrder) : 'asc';

    if (!controlledSortedColumn) {
      setSortKey(nextOrder ? nextKey : null);
      setSortOrder(nextOrder);
    }

    emitChange(currentPage, pageSize, nextOrder ? nextKey : null, nextOrder);
  };

  const isAllSelected = visibleData.length > 0 && visibleData.every((record, index) => effectiveSelected.includes(getKey(record, startIndex + index)));
  const isIndeterminate = visibleData.some((record, index) => effectiveSelected.includes(getKey(record, startIndex + index))) && !isAllSelected;

  const toggleAll = () => {
    const pageKeys = visibleData.map((record, index) => getKey(record, startIndex + index));
    if (isAllSelected) {
      const next = effectiveSelected.filter((key) => !pageKeys.includes(key));
      if (!rowSelection?.selectedRowKeys) setSelectedKeys(next);
      rowSelection?.onChange?.(
        next,
        sortedData.filter((record, index) => next.includes(getKey(record, index))),
      );
      return;
    }

    const next = Array.from(new Set([...effectiveSelected, ...pageKeys]));
    if (!rowSelection?.selectedRowKeys) setSelectedKeys(next);
    rowSelection?.onChange?.(
      next,
      sortedData.filter((record, index) => next.includes(getKey(record, index))),
    );
  };

  const toggleRow = (key: string) => {
    const next = effectiveSelected.includes(key)
      ? effectiveSelected.filter((item) => item !== key)
      : [...effectiveSelected, key];

    if (!rowSelection?.selectedRowKeys) setSelectedKeys(next);
    rowSelection?.onChange?.(
      next,
      sortedData.filter((record, index) => next.includes(getKey(record, index))),
    );
  };

  const wrapperCls = [
    'orot-table-wrapper',
    loading && 'orot-table-wrapper--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tableCls = [
    'orot-table',
    `orot-table--${size}`,
    bordered && 'orot-table--bordered',
  ]
    .filter(Boolean)
    .join(' ');

  const parseWidth = (width: string | number | undefined) => {
    if (typeof width === 'number') return width;
    if (typeof width === 'string' && width.endsWith('px')) return Number.parseFloat(width);
    return 0;
  };

  const getStickyStyle = (index: number) => {
    const column = columns[index];
    if (column.fixed !== 'left' && column.fixed !== 'right') return undefined;

    if (column.fixed === 'left') {
      const left = columns
        .slice(0, index)
        .reduce((totalWidth, currentColumn) => totalWidth + (currentColumn.fixed === 'left' ? parseWidth(currentColumn.width) : 0), 0);
      return { left: `${left}px` };
    }

    const right = columns
      .slice(index + 1)
      .reduce((totalWidth, currentColumn) => totalWidth + (currentColumn.fixed === 'right' ? parseWidth(currentColumn.width) : 0), 0);
    return { right: `${right}px` };
  };

  const handlePageChange = (nextPage: number, nextPageSize: number) => {
    if (paginationConfig?.current === undefined) {
      setInternalCurrent(nextPage);
    }
    if (paginationConfig?.pageSize === undefined) {
      setInternalPageSize(nextPageSize);
    }
    paginationConfig?.onChange?.(nextPage, nextPageSize);
    emitChange(nextPage, nextPageSize);
  };

  const handlePageSizeChange = (nextCurrent: number, nextPageSize: number) => {
    if (paginationConfig?.pageSize === undefined) {
      setInternalPageSize(nextPageSize);
    }
    if (paginationConfig?.current === undefined) {
      setInternalCurrent(nextCurrent);
    }
    paginationConfig?.onShowSizeChange?.(nextCurrent, nextPageSize);
    emitChange(nextCurrent, nextPageSize);
  };

  const resolvedEmptyText = locale?.emptyText ?? emptyText;

  return (
    <div
      className={wrapperCls}
      style={style}
      {...rest}
    >
      <div
        className="orot-table__scroll"
        style={{ ...(scroll?.y ? { maxHeight: scroll.y } : {}), ...(scroll?.x ? { maxWidth: scroll.x } : {}) }}
      >
        <table
          className={tableCls}
          style={scroll?.x ? { minWidth: typeof scroll.x === 'number' ? `${scroll.x}px` : scroll.x } : undefined}
        >
          <thead className="orot-table__head">
            <tr>
              {rowSelection && (
                <th className="orot-table__th orot-table__th--selection">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(element) => { if (element) element.indeterminate = isIndeterminate; }}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={[
                    'orot-table__th',
                    column.sorter && 'orot-table__th--sortable',
                    column.fixed && `orot-table__th--fixed-${column.fixed}`,
                  ].filter(Boolean).join(' ')}
                  style={{ width: column.width, textAlign: column.align, ...getStickyStyle(index) }}
                  onClick={column.sorter ? () => handleSort(column) : undefined}
                >
                  {column.title}
                  {column.sorter && (
                    <span className={`orot-table__sort-icon${sortKey === column.key ? ` orot-table__sort-icon--${sortOrder}` : ''}`}>
                      <span className="orot-table__sort-up">▲</span>
                      <span className="orot-table__sort-down">▼</span>
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="orot-table__empty"
                >
                  {resolvedEmptyText}
                </td>
              </tr>
            ) : (
              visibleData.map((record, index) => {
                const absoluteIndex = startIndex + index;
                const key = getKey(record, absoluteIndex);
                const isSelected = effectiveSelected.includes(key);
                const resolvedRowClassName =
                  typeof rowClassName === 'function'
                    ? rowClassName(record, absoluteIndex)
                    : rowClassName;

                return (
                  <tr
                    key={key}
                    className={[
                      'orot-table__row',
                      isSelected && 'orot-table__row--selected',
                      resolvedRowClassName,
                    ].filter(Boolean).join(' ')}
                  >
                    {rowSelection && (
                      <td className="orot-table__td orot-table__td--selection">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                        />
                      </td>
                    )}
                    {columns.map((column, columnIndex) => {
                      const value = column.dataIndex ? record[column.dataIndex] : undefined;
                      const content = column.render
                        ? column.render(value, record, absoluteIndex)
                        : String(value ?? '');
                      return (
                        <td
                          key={column.key}
                          className={[
                            'orot-table__td',
                            column.ellipsis && 'orot-table__td--ellipsis',
                            column.fixed && `orot-table__td--fixed-${column.fixed}`,
                          ].filter(Boolean).join(' ')}
                          style={{ textAlign: column.align, ...getStickyStyle(columnIndex) }}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {paginationConfig && total > 0 && (!paginationConfig.hideOnSinglePage || totalPages > 1) && (
        <div className="orot-table__pagination">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            showSizeChanger={paginationConfig.showSizeChanger}
            pageSizeOptions={paginationConfig.pageSizeOptions}
            showTotal={paginationConfig.showTotal}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
