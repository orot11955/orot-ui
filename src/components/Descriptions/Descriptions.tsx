import { Fragment } from 'react';
import './Descriptions.css';
import type { DescriptionsItem, DescriptionsProps } from './Descriptions.types';

/** items를 column 기준으로 행별로 분할 */
function buildRows(items: DescriptionsItem[], column: number): DescriptionsItem[][] {
  const rows: DescriptionsItem[][] = [];
  let row: DescriptionsItem[] = [];
  let colUsed = 0;

  for (const item of items) {
    const span = item.span ?? 1;
    if (colUsed + span > column && row.length > 0) {
      rows.push(row);
      row = [];
      colUsed = 0;
    }
    row.push(item);
    colUsed += span;
    if (colUsed >= column) {
      rows.push(row);
      row = [];
      colUsed = 0;
    }
  }
  if (row.length > 0) rows.push(row);
  return rows;
}

export function Descriptions({
  items,
  title,
  extra,
  bordered = false,
  column = 3,
  size = 'md',
  layout = 'horizontal',
  className = '',
  style,
}: DescriptionsProps) {
  const rows = buildRows(items, column);
  const getItemKey = (item: DescriptionsItem, rowIndex: number, cellIndex: number) =>
    item.key ?? `row-${rowIndex}-cell-${cellIndex}`;

  const cls = [
    'orot-desc',
    bordered && 'orot-desc--bordered',
    `orot-desc--${size}`,
    `orot-desc--${layout}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      {(title || extra) && (
        <div className="orot-desc__header">
          {title && <div className="orot-desc__title">{title}</div>}
          {extra && <div className="orot-desc__extra">{extra}</div>}
        </div>
      )}
      <table className="orot-desc__table">
        <tbody>
          {rows.map((row, ri) =>
            layout === 'vertical' ? (
              <Fragment key={`row-${ri}`}>
                <tr key={`label-${ri}`} className="orot-desc__row orot-desc__row--label">
                  {row.map((item, ci) => (
                    <th
                      key={getItemKey(item, ri, ci)}
                      className="orot-desc__cell orot-desc__label"
                      colSpan={item.span ?? 1}
                    >
                      {item.label}
                    </th>
                  ))}
                </tr>
                <tr key={`content-${ri}`} className="orot-desc__row orot-desc__row--content">
                  {row.map((item, ci) => (
                    <td
                      key={getItemKey(item, ri, ci)}
                      className="orot-desc__cell orot-desc__content"
                      colSpan={item.span ?? 1}
                    >
                      {item.children}
                    </td>
                  ))}
                </tr>
              </Fragment>
            ) : (
              <tr key={ri} className="orot-desc__row">
                {row.map((item, ci) => (
                  <Fragment key={getItemKey(item, ri, ci)}>
                    <th className="orot-desc__cell orot-desc__label">
                      {item.label}
                    </th>
                    <td
                      className="orot-desc__cell orot-desc__content"
                      colSpan={item.span ? item.span * 2 - 1 : 1}
                    >
                      {item.children}
                    </td>
                  </Fragment>
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
