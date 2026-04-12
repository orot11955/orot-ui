export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaQuery = {
  up: (bp: Breakpoint) => `@media (min-width: ${breakpoints[bp]}px)`,
  down: (bp: Breakpoint) => `@media (max-width: ${breakpoints[bp] - 1}px)`,
  between: (min: Breakpoint, max: Breakpoint) =>
    `@media (min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`,
} as const;
