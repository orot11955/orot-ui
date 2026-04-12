import './Steps.css';
import type { StepsProps, StepStatus } from './Steps.types';

export function Steps({
  items,
  current = 0,
  direction = 'horizontal',
  progressDot = false,
  size = 'md',
  onChange,
  className = '',
  style,
  ...rest
}: StepsProps) {
  const cls = [
    'orot-steps',
    `orot-steps--${direction}`,
    progressDot && 'orot-steps--dot',
    `orot-steps--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      {items.map((item, index) => {
        const status: StepStatus =
          item.status ??
          (index < current ? 'finish' : index === current ? 'process' : 'wait');

        const isLast = index === items.length - 1;
        const isClickable = !!onChange && !item.disabled;

        const stepCls = [
          'orot-step',
          `orot-step--${status}`,
          isClickable && 'orot-step--clickable',
          item.disabled && 'orot-step--disabled',
        ]
          .filter(Boolean)
          .join(' ');

        const iconContent =
          item.icon ??
          (progressDot ? null : status === 'finish' ? '✓' : status === 'error' ? '✕' : index + 1);

        return (
          <div
            key={index}
            className={stepCls}
            onClick={() => isClickable && onChange?.(index)}
          >
            <div className="orot-step__icon-wrap">
              <div className="orot-step__icon">{iconContent}</div>
              {!isLast && <div className="orot-step__tail" />}
            </div>
            <div className="orot-step__content">
              <div className="orot-step__title">{item.title}</div>
              {item.description && (
                <div className="orot-step__description">{item.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
