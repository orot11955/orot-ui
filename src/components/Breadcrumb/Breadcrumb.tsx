import { Dropdown } from '../Dropdown';
import './Breadcrumb.css';
import type { BreadcrumbProps } from './Breadcrumb.types';

export function Breadcrumb({
  items,
  separator = '/',
  className = '',
  style,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={['orot-breadcrumb', className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <ol className="orot-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const menuTrigger = item.menu && !isLast ? (
            <Dropdown menu={item.menu} trigger="click" placement="bottomLeft" arrow>
              <button type="button" className="orot-breadcrumb__dropdown-trigger">
                <span className="orot-breadcrumb__link">{item.title}</span>
                <span className="orot-breadcrumb__menu-arrow" aria-hidden="true">▾</span>
              </button>
            </Dropdown>
          ) : null;

          return (
            <li key={index} className="orot-breadcrumb__item">
              {menuTrigger ?? (item.href && !isLast ? (
                <a
                  href={item.href}
                  className="orot-breadcrumb__link"
                  onClick={item.onClick as React.MouseEventHandler<HTMLAnchorElement>}
                >
                  {item.title}
                </a>
              ) : item.onClick && !isLast ? (
                <span
                  className="orot-breadcrumb__link orot-breadcrumb__link--clickable"
                  onClick={item.onClick as React.MouseEventHandler<HTMLSpanElement>}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      item.onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
                    }
                  }}
                >
                  {item.title}
                </span>
              ) : (
                <span
                  className={isLast ? 'orot-breadcrumb__current' : 'orot-breadcrumb__text'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.title}
                </span>
              ))}
              {!isLast && (
                <span className="orot-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
