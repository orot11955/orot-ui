import './Card.css';
import type { CardProps } from './Card.types';

export function Card({
  title,
  extra,
  bordered = true,
  size = 'md',
  actions,
  loading = false,
  hoverable = false,
  children,
  className = '',
  style,
  ...rest
}: CardProps) {
  const cls = [
    'orot-card',
    `orot-card--${size}`,
    bordered && 'orot-card--bordered',
    hoverable && 'orot-card--hoverable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      {(title !== undefined || extra !== undefined) && (
        <div className="orot-card__head">
          {title !== undefined && <div className="orot-card__title">{title}</div>}
          {extra !== undefined && <div className="orot-card__extra">{extra}</div>}
        </div>
      )}

      {loading ? (
        <div className="orot-card__loading">
          <div className="orot-card__loading-block" />
          <div className="orot-card__loading-block" />
          <div className="orot-card__loading-block orot-card__loading-block--short" />
        </div>
      ) : (
        <div className="orot-card__body">{children}</div>
      )}

      {actions && actions.length > 0 && (
        <ul className="orot-card__actions">
          {actions.map((action, i) => (
            <li key={i} className="orot-card__actions-item">
              {action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
