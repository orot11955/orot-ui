import './Timeline.css';
import type { TimelineItemProps, TimelineProps } from './Timeline.types';

const PRESET_COLORS: Record<string, string> = {
  blue: 'var(--orot-color-primary)',
  red: 'var(--orot-color-error)',
  green: 'var(--orot-color-success)',
  gray: 'var(--orot-color-text-quaternary)',
  orange: 'var(--orot-color-warning)',
};

function TimelineItem({
  color = 'blue',
  dot,
  label,
  pending = false,
  children,
  className = '',
  style,
}: TimelineItemProps) {
  const dotColor = PRESET_COLORS[color] ?? color;

  return (
    <li
      className={[
        'orot-timeline__item',
        label !== undefined && 'orot-timeline__item--has-label',
        pending && 'orot-timeline__item--pending',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="orot-timeline__label">{label ?? null}</div>
      <div className="orot-timeline__tail-wrapper">
        <div
          className={['orot-timeline__dot', dot ? 'orot-timeline__dot--custom' : ''].filter(Boolean).join(' ')}
          style={!dot ? { borderColor: dotColor } : undefined}
        >
          {dot ?? null}
        </div>
        <div className="orot-timeline__tail" />
      </div>
      <div className="orot-timeline__content">{children}</div>
    </li>
  );
}

export function Timeline({
  mode = 'left',
  pending,
  pendingDot,
  reverse = false,
  items,
  children,
  className = '',
  style,
}: TimelineProps) {
  let renderItems: TimelineItemProps[] = items
    ? [...items]
    : [];

  if (pending) {
    renderItems.push({
      pending: true,
      dot: pendingDot ?? <span className="orot-timeline__pending-dot" />,
      children: typeof pending === 'boolean' ? null : pending,
    });
  }

  if (reverse) renderItems = renderItems.reverse();

  return (
    <ul
      className={[
        'orot-timeline',
        `orot-timeline--${mode}`,
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {renderItems.map((item, i) => (
        <TimelineItem key={i} {...item} />
      ))}
      {children}
    </ul>
  );
}

Timeline.Item = TimelineItem;
