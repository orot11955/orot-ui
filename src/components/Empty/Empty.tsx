import './Empty.css';
import type { EmptyProps } from './Empty.types';

function DefaultImage() {
  return (
    <svg
      className="orot-empty__svg"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Open box body */}
      <path
        d="M10 30 L10 54 Q10 56 12 56 L52 56 Q54 56 54 54 L54 30 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left lid flap */}
      <path
        d="M10 30 L18 18 L32 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right lid flap */}
      <path
        d="M54 30 L46 18 L32 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SimpleImage() {
  return (
    <svg
      className="orot-empty__svg orot-empty__svg--simple"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 30 L10 54 Q10 56 12 56 L52 56 Q54 56 54 54 L54 30 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 30 L18 18 L32 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M54 30 L46 18 L32 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Empty({
  image = 'simple',
  imageStyle,
  description = '데이터 없음',
  children,
  className = '',
  style,
}: EmptyProps) {
  const cls = ['orot-empty', className].filter(Boolean).join(' ');

  const renderImage = () => {
    if (image === 'default') return <DefaultImage />;
    if (image === 'simple') return <SimpleImage />;
    if (image === null || image === false) return null;
    return image;
  };

  return (
    <div className={cls} style={style} role="status" aria-label={typeof description === 'string' ? description : 'empty'}>
      <div className="orot-empty__image" style={imageStyle}>
        {renderImage()}
      </div>
      {description !== false && (
        <p className="orot-empty__description">{description}</p>
      )}
      {children && <div className="orot-empty__footer">{children}</div>}
    </div>
  );
}
