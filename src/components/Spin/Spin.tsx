import { useEffect, useState } from 'react';
import './Spin.css';
import type { SpinProps } from './Spin.types';

export function Spin({
  size = 'md',
  tip,
  spinning = true,
  delay = 0,
  fullscreen = false,
  indicator,
  children,
  className = '',
  style,
  ...rest
}: SpinProps) {
  const [displaySpinning, setDisplaySpinning] = useState(delay <= 0 ? spinning : false);

  useEffect(() => {
    if (!spinning) {
      setDisplaySpinning(false);
      return;
    }

    if (delay <= 0) {
      setDisplaySpinning(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDisplaySpinning(true);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [spinning, delay]);

  const indicatorNode = indicator ?? <span className="orot-spin__ring" />;

  if (children) {
    return (
      <div
        className={[
          'orot-spin-container',
          displaySpinning && 'orot-spin-container--spinning',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
        {...rest}
      >
        {children}
        {displaySpinning && (
          <div className="orot-spin-overlay">
            <div className={`orot-spin orot-spin--${size}`}>
              {indicatorNode}
              {tip && <span className="orot-spin__tip">{tip}</span>}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!displaySpinning) return null;

  if (fullscreen) {
    return (
      <div className="orot-spin-fullscreen" {...rest}>
        <div
          className={['orot-spin', `orot-spin--${size}`, className].filter(Boolean).join(' ')}
          style={style}
          role="status"
          aria-label="loading"
        >
          {indicatorNode}
          {tip && <span className="orot-spin__tip">{tip}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={['orot-spin', `orot-spin--${size}`, className].filter(Boolean).join(' ')}
      style={style}
      role="status"
      aria-label="loading"
      {...rest}
    >
      {indicatorNode}
      {tip && <span className="orot-spin__tip">{tip}</span>}
    </div>
  );
}
