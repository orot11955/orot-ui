import type { IconProps } from './Icon.types';

export function Icon({ as: LucideIcon, size = 16, className = '', ...rest }: IconProps) {
  return (
    <LucideIcon
      size={size}
      className={`orot-icon ${className}`.trim()}
      {...rest}
    />
  );
}
