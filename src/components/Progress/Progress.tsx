import './Progress.css';
import type { ProgressProps } from './Progress.types';

const CIRCLE_SIZE = {
  sm: 64,
  md: 80,
};

export function Progress({
  type = 'line',
  percent = 0,
  status = 'normal',
  showInfo = true,
  strokeWidth,
  size = 'md',
  format,
  strokeColor,
  trailColor,
  steps,
  success,
  className = '',
  style,
  ...rest
}: ProgressProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const successPercent = Math.max(0, Math.min(clampedPercent, success?.percent ?? 0));
  const infoText = format ? format(clampedPercent) : `${clampedPercent}%`;

  const effectiveStatus =
    status === 'normal' && clampedPercent === 100 ? 'success' : status;
  const barColor =
    strokeColor ??
    (effectiveStatus === 'success'
      ? 'var(--orot-color-success)'
      : effectiveStatus === 'exception'
        ? 'var(--orot-color-danger)'
        : 'var(--orot-color-primary)');
  const trail = trailColor ?? 'var(--orot-color-bg-tertiary)';
  const successColor = success?.strokeColor ?? 'var(--orot-color-success)';
  const lineTrackStyle =
    strokeWidth !== undefined
      ? { background: trail, height: strokeWidth }
      : { background: trail };
  const lineBarStyle =
    strokeWidth !== undefined
      ? { height: strokeWidth, background: barColor }
      : { background: barColor };
  const successBarStyle = {
    width: `${successPercent}%`,
    background: successColor,
  };
  const activePercent = Math.max(clampedPercent - successPercent, 0);

  if (type === 'circle' || type === 'dashboard') {
    const trackStroke = strokeWidth ?? 4;
    const svgSize = CIRCLE_SIZE[size];
    const r = svgSize / 2 - trackStroke / 2 - 2;
    const circumference = 2 * Math.PI * r;
    const visibleLength = type === 'dashboard' ? circumference * 0.75 : circumference;
    const gapLength = circumference - visibleLength;
    const offset = visibleLength * (1 - clampedPercent / 100);

    return (
      <div
        className={[
          'orot-progress',
          'orot-progress--circle',
          type === 'dashboard' && 'orot-progress--dashboard',
          `orot-progress--${effectiveStatus}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <div className="orot-progress__circle" style={{ width: svgSize, height: svgSize }}>
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={r}
              fill="none"
              stroke={trail}
              strokeWidth={trackStroke}
              strokeDasharray={`${visibleLength} ${gapLength}`}
              transform={`rotate(${type === 'dashboard' ? 135 : -90} ${svgSize / 2} ${svgSize / 2})`}
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={r}
              fill="none"
              stroke={barColor}
              strokeWidth={trackStroke}
              strokeDasharray={`${visibleLength} ${gapLength}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(${type === 'dashboard' ? 135 : -90} ${svgSize / 2} ${svgSize / 2})`}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          {showInfo && (
            <span className="orot-progress__circle-text">{infoText}</span>
          )}
        </div>
      </div>
    );
  }

  const cls = [
    'orot-progress',
    `orot-progress--${size}`,
    `orot-progress--${effectiveStatus}`,
    steps && 'orot-progress--steps',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const lineStyle = steps
    ? { ...style, ['--orot-progress-steps' as string]: steps }
    : style;

  return (
    <div
      className={cls}
      style={lineStyle}
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      {steps ? (
        <div className="orot-progress__steps-track">
          {Array.from({ length: steps }).map((_, index) => {
            const stepPercent = ((index + 1) / steps) * 100;
            const isSuccess = stepPercent <= successPercent;
            const isActive = stepPercent <= clampedPercent;

            return (
              <span
                key={index}
                className={[
                  'orot-progress__step',
                  isActive && 'orot-progress__step--active',
                  isSuccess && 'orot-progress__step--success',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  background: isSuccess ? successColor : isActive ? barColor : trail,
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="orot-progress__track" style={lineTrackStyle}>
          {successPercent > 0 && (
            <div
              className="orot-progress__success-bar"
              style={successBarStyle}
            />
          )}
          <div
            className="orot-progress__bar"
            style={{
              width: `${activePercent}%`,
              left: `${successPercent}%`,
              ...lineBarStyle,
            }}
          />
        </div>
      )}
      {showInfo && (
        <span className="orot-progress__info">{infoText}</span>
      )}
    </div>
  );
}
