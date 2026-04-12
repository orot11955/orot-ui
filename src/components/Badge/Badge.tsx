import './Badge.css';
import type { BadgeProps } from './Badge.types';

export function Badge({
  count,
  dot = false,
  overflowCount = 99,
  showZero = false,
  status,
  color,
  text,
  children,
  className = '',
  style,
  ...rest
}: BadgeProps) {
  // Status badge (no wrapper)
  if (status) {
    const cls = ['orot-badge', 'orot-badge--status', `orot-badge--${status}`, className]
      .filter(Boolean)
      .join(' ');
    return (
      <span className={cls} style={style} {...rest}>
        <span className="orot-badge__status-dot" style={color ? { background: color } : undefined} />
        {text && <span className="orot-badge__status-text">{text}</span>}
      </span>
    );
  }

  const standalone = children === undefined;

  const cls = [
    'orot-badge',
    standalone && 'orot-badge--standalone',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const displayCount =
    typeof count === 'number' && count > overflowCount ? `${overflowCount}+` : count;

  const showCount =
    dot
      ? false
      : count !== undefined && (showZero || (typeof count === 'number' ? count > 0 : true));

  return (
    <span className={cls} style={style} {...rest}>
      {children}
      {dot && (
        <span
          className="orot-badge__dot"
          style={color ? { background: color } : undefined}
          aria-label="notification dot"
        />
      )}
      {showCount && (
        <span
          className="orot-badge__count"
          style={color ? { background: color } : undefined}
        >
          {displayCount}
        </span>
      )}
    </span>
  );
}
