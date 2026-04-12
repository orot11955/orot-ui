import { useState, Children, cloneElement, isValidElement } from 'react';
import './Avatar.css';
import type { AvatarGroupProps, AvatarProps } from './Avatar.types';

const SIZE_MAP = { sm: 24, md: 32, lg: 40 };

export function Avatar({
  src,
  srcSet,
  alt,
  icon,
  shape = 'circle',
  size = 'md',
  gap = 4,
  draggable,
  crossOrigin,
  onError,
  children,
  className = '',
  style,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const px = typeof size === 'number' ? size : SIZE_MAP[size];

  const handleError = () => {
    const skip = onError?.();
    if (skip !== true) setImgError(true);
  };

  const cls = [
    'orot-avatar',
    `orot-avatar--${shape}`,
    className,
  ].filter(Boolean).join(' ');

  const childStr = typeof children === 'string' ? children : '';
  const charCount = Math.max(1, childStr.length);
  const baseFontSize = px / 2.5;
  const availableWidth = px - 2 * gap;
  // CJK chars are ~1em wide; scale down font if text would overflow
  const fontSize = charCount > 1
    ? Math.min(baseFontSize, availableWidth / (charCount * 1.1))
    : baseFontSize;

  const sizeStyle: React.CSSProperties = {
    width: px,
    height: px,
    fontSize,
    lineHeight: `${px}px`,
    ...style,
  };

  const showImg = src && !imgError;

  return (
    <span className={cls} style={sizeStyle}>
      {showImg ? (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          draggable={draggable}
          crossOrigin={crossOrigin}
          className="orot-avatar__img"
          onError={handleError}
        />
      ) : icon ? (
        <span className="orot-avatar__icon">{icon}</span>
      ) : children ? (
        <span
          className="orot-avatar__string"
          style={{ padding: `0 ${gap}px` }}
        >
          {children}
        </span>
      ) : (
        <span className="orot-avatar__placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </span>
      )}
    </span>
  );
}

function AvatarGroup({
  children,
  maxCount,
  maxStyle,
  size,
  shape,
  className = '',
  style,
}: AvatarGroupProps) {
  const childArray = Children.toArray(children);
  const visible = maxCount !== undefined ? childArray.slice(0, maxCount) : childArray;
  const overflowCount = maxCount !== undefined ? childArray.length - maxCount : 0;

  return (
    <div className={['orot-avatar-group', className].filter(Boolean).join(' ')} style={style}>
      {visible.map((child, i) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<AvatarProps>, {
              key: i,
              size: (child.props as AvatarProps).size ?? size,
              shape: (child.props as AvatarProps).shape ?? shape,
            })
          : child,
      )}
      {overflowCount > 0 && (
        <Avatar size={size} shape={shape} style={maxStyle}>
          +{overflowCount}
        </Avatar>
      )}
    </div>
  );
}

Avatar.Group = AvatarGroup;
