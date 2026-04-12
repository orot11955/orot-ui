import './Divider.css';
import type { DividerProps } from './Divider.types';

export function Divider({
  type = 'horizontal',
  orientation,
  dashed = false,
  label,
  labelPosition = 'center',
  titlePlacement,
  plain = false,
  orientationMargin,
  children,
  className = '',
  style,
  ...rest
}: DividerProps) {
  const resolvedType = orientation ?? type;
  // children 우선, 그 다음 label (하위 호환)
  const content = children ?? label;
  // titlePlacement 우선, 그 다음 labelPosition (하위 호환)
  const position = titlePlacement ?? labelPosition;
  const resolvedMargin =
    typeof orientationMargin === 'number'
      ? `${orientationMargin}px`
      : orientationMargin;

  const dividerStyle = {
    ...(resolvedMargin ? { ['--orot-divider-orientation-margin' as const]: resolvedMargin } : {}),
    ...style,
  };

  if (resolvedType === 'vertical') {
    const cls = [
      'orot-divider',
      'orot-divider--vertical',
      dashed && 'orot-divider--dashed',
      className,
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <span
        className={cls}
        role="separator"
        aria-orientation="vertical"
        style={dividerStyle}
        {...rest}
      />
    );
  }

  const hasContent = !!content;
  const cls = [
    'orot-divider',
    'orot-divider--horizontal',
    dashed && 'orot-divider--dashed',
    plain && 'orot-divider--plain',
    !hasContent && 'orot-divider--no-label',
    hasContent && `orot-divider--label-${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!hasContent) {
    return (
      <div
        className={cls}
        role="separator"
        aria-orientation="horizontal"
        style={dividerStyle}
        {...rest}
      />
    );
  }

  return (
    <div
      className={cls}
      role="separator"
      aria-orientation="horizontal"
      style={dividerStyle}
      {...rest}
    >
      <span className="orot-divider__label">{content}</span>
    </div>
  );
}
