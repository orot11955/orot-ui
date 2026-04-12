import './Result.css';
import type { ResultProps, ResultStatus } from './Result.types';

const STATUS_ICONS: Record<ResultStatus, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  '404': '404',
  '403': '403',
  '500': '500',
};

export function Result({
  status = 'info',
  title,
  subTitle,
  extra,
  icon,
  children,
  className = '',
  style,
  ...rest
}: ResultProps) {
  const cls = [
    'orot-result',
    `orot-result--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      <div className="orot-result__icon">
        {icon ?? STATUS_ICONS[status]}
      </div>
      {title && <div className="orot-result__title">{title}</div>}
      {subTitle && <div className="orot-result__subtitle">{subTitle}</div>}
      {extra && <div className="orot-result__extra">{extra}</div>}
      {children}
    </div>
  );
}
