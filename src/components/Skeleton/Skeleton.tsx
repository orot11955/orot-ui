import './Skeleton.css';
import type {
  SkeletonAvatarProps,
  SkeletonButtonProps,
  SkeletonElementProps,
  SkeletonImageProps,
  SkeletonProps,
} from './Skeleton.types';

const ELEMENT_SIZES = {
  sm: { width: 72, height: 24 },
  md: { width: 96, height: 32 },
  lg: { width: 120, height: 40 },
} as const;

function resolveElementSize(size: SkeletonElementProps['size'], fallback: { width: number; height: number }) {
  if (typeof size === 'number') {
    return { width: size, height: size };
  }

  if (!size) {
    return fallback;
  }

  return ELEMENT_SIZES[size];
}

function SkeletonElement({
  active = false,
  className = '',
  style,
  children,
  ...rest
}: SkeletonElementProps) {
  return (
    <div
      className={['orot-skeleton', active && 'orot-skeleton--active', className].filter(Boolean).join(' ')}
      style={style}
      aria-busy="true"
      {...rest}
    >
      {children}
    </div>
  );
}

function SkeletonRoot({
  active = false,
  loading = true,
  avatar = false,
  title = true,
  paragraph = true,
  round = false,
  children,
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  if (!loading) return <>{children}</>;

  const avatarShape =
    typeof avatar === 'object' ? avatar.shape ?? 'circle' : 'circle';
  const avatarSize = typeof avatar === 'object' ? avatar.size ?? 'md' : 'md';
  const resolvedAvatarSize =
    typeof avatarSize === 'number'
      ? `${avatarSize}px`
      : avatarSize === 'sm'
        ? '24px'
        : avatarSize === 'lg'
          ? '48px'
          : '40px';

  const titleWidth =
    typeof title === 'object' ? title.width ?? '38%' : '38%';

  const rows =
    typeof paragraph === 'object' ? paragraph.rows ?? 3 : paragraph ? 3 : 0;

  const widths =
    typeof paragraph === 'object' && paragraph.width !== undefined
      ? Array.isArray(paragraph.width)
        ? paragraph.width
        : Array.from({ length: rows }, () => paragraph.width as string | number)
      : Array.from({ length: rows }, (_, i) => (i === rows - 1 ? '61%' : '100%'));

  const cls = [
    'orot-skeleton',
    'orot-skeleton--root',
    active && 'orot-skeleton--active',
    round && 'orot-skeleton--round',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} aria-busy="true" {...rest}>
      <div className="orot-skeleton__row">
        {avatar && (
          <div
            className={[
              'orot-skeleton__block',
              'orot-skeleton__avatar',
              avatarShape === 'square' && 'orot-skeleton__avatar--square',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ width: resolvedAvatarSize, height: resolvedAvatarSize }}
          />
        )}
        <div className="orot-skeleton__content">
          {title && (
            <div
              className="orot-skeleton__block orot-skeleton__title"
              style={{ width: typeof titleWidth === 'number' ? `${titleWidth}px` : titleWidth }}
            />
          )}
          {rows > 0 && (
            <div className="orot-skeleton__paragraph">
              {Array.from({ length: rows }).map((_, i) => (
                <div
                  key={i}
                  className="orot-skeleton__block orot-skeleton__line"
                  style={{
                    width:
                      typeof widths[i] === 'number'
                        ? `${widths[i]}px`
                        : (widths[i] as string) ?? '100%',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonButton({
  active = false,
  size = 'md',
  shape = 'round',
  block = false,
  className = '',
  style,
  ...rest
}: SkeletonButtonProps) {
  const { width, height } = resolveElementSize(size, ELEMENT_SIZES.md);

  return (
    <SkeletonElement active={active} className={className} style={style} {...rest}>
      <div
        className={[
          'orot-skeleton__block',
          'orot-skeleton__element',
          'orot-skeleton__element--button',
          shape === 'round' && 'orot-skeleton__element--round',
          shape === 'circle' && 'orot-skeleton__element--circle',
          block && 'orot-skeleton__element--block',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: block ? '100%' : `${width}px`,
          height: `${height}px`,
        }}
      />
    </SkeletonElement>
  );
}

function SkeletonAvatar({
  active = false,
  size = 'md',
  shape = 'circle',
  className = '',
  style,
  ...rest
}: SkeletonAvatarProps) {
  const { width, height } = resolveElementSize(size, { width: 40, height: 40 });

  return (
    <SkeletonElement active={active} className={className} style={style} {...rest}>
      <div
        className={[
          'orot-skeleton__block',
          'orot-skeleton__element',
          'orot-skeleton__element--avatar',
          shape === 'square' && 'orot-skeleton__avatar--square',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </SkeletonElement>
  );
}

function SkeletonInput({
  active = false,
  size = 'md',
  block = false,
  className = '',
  style,
  ...rest
}: SkeletonElementProps) {
  const { width, height } = resolveElementSize(size, { width: 180, height: 32 });

  return (
    <SkeletonElement active={active} className={className} style={style} {...rest}>
      <div
        className={[
          'orot-skeleton__block',
          'orot-skeleton__element',
          'orot-skeleton__element--input',
          block && 'orot-skeleton__element--block',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: block ? '100%' : `${width}px`,
          height: `${height}px`,
        }}
      />
    </SkeletonElement>
  );
}

function SkeletonImage({
  active = false,
  width = '100%',
  height = 160,
  className = '',
  style,
  ...rest
}: SkeletonImageProps) {
  return (
    <SkeletonElement active={active} className={className} style={style} {...rest}>
      <div
        className={[
          'orot-skeleton__block',
          'orot-skeleton__element',
          'orot-skeleton__element--image',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      />
    </SkeletonElement>
  );
}

export const Skeleton = Object.assign(SkeletonRoot, {
  Button: SkeletonButton,
  Avatar: SkeletonAvatar,
  Input: SkeletonInput,
  Image: SkeletonImage,
});
