import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
} from 'react';
import './Layout.css';
import { breakpoints } from '../../utils/breakpoints';
import type {
  LayoutProps,
  SiderProps,
  HeaderProps,
  ContentProps,
  FooterProps,
} from './Layout.types';

/* ── Header ──────────────────────────────────────────── */
function Header({ className = '', children, ...rest }: HeaderProps) {
  return (
    <header
      className={`orot-layout-header${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </header>
  );
}

/* ── Sider ───────────────────────────────────────────── */
function Sider({
  width = 220,
  collapsedWidth = 48,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  breakpoint,
  reverseArrow = false,
  zeroWidthTriggerStyle,
  theme = 'light',
  trigger,
  onCollapse,
  onBreakpoint,
  className = '',
  style,
  children,
  ...rest
}: SiderProps) {
  const isControlled = controlledCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [broken, setBroken] = useState(false);
  const brokenRef = useRef<boolean | null>(null);
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  useEffect(() => {
    if (!breakpoint) return;

    const bp = breakpoints[breakpoint];
    const check = () => {
      const nextBroken = window.innerWidth < bp;
      setBroken(nextBroken);

      if (brokenRef.current === nextBroken) {
        return;
      }

      brokenRef.current = nextBroken;
      onBreakpoint?.(nextBroken);

      if (isControlled) {
        onCollapse?.(nextBroken);
        return;
      }

      setInternalCollapsed(nextBroken);
      onCollapse?.(nextBroken);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint, isControlled, onBreakpoint, onCollapse]);

  const toggle = () => {
    const next = !collapsed;
    if (!isControlled) setInternalCollapsed(next);
    onCollapse?.(next);
  };

  const currentWidth = collapsed ? collapsedWidth : width;
  const siderStyle: CSSProperties = {
    width: typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth,
    minWidth: typeof currentWidth === 'number' ? `${currentWidth}px` : currentWidth,
    ...style,
  };

  const showZeroWidthTrigger = collapsible && collapsed && currentWidth === 0;

  const cls = [
    'orot-layout-sider',
    collapsed && 'orot-layout-sider--collapsed',
    broken && 'orot-layout-sider--broken',
    showZeroWidthTrigger && 'orot-layout-sider--zero-width',
    theme === 'dark' && 'orot-layout-sider--dark',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const defaultTrigger = reverseArrow
    ? collapsed ? '‹' : '›'
    : collapsed ? '›' : '‹';

  return (
    <aside className={cls} style={siderStyle} {...rest}>
      <div className="orot-layout-sider__content" aria-hidden={collapsed}>
        {children}
      </div>
      {collapsible && trigger !== null && (
        <button
          className={`orot-layout-sider__trigger${showZeroWidthTrigger ? ' orot-layout-sider__trigger--zero-width' : ''}`}
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={showZeroWidthTrigger ? zeroWidthTriggerStyle : undefined}
        >
          {trigger ?? defaultTrigger}
        </button>
      )}
    </aside>
  );
}

/* ── Content ─────────────────────────────────────────── */
function Content({ className = '', children, ...rest }: ContentProps) {
  return (
    <main
      className={`orot-layout-content${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </main>
  );
}

/* ── Footer ──────────────────────────────────────────── */
function Footer({ className = '', children, ...rest }: FooterProps) {
  return (
    <footer
      className={`orot-layout-footer${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {children}
    </footer>
  );
}

/* ── Layout ──────────────────────────────────────────── */
function LayoutRoot({ hasSider, className = '', children, ...rest }: LayoutProps) {
  const cls = [
    'orot-layout',
    hasSider && 'orot-layout--has-sider',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

/* ── Compound export ─────────────────────────────────── */
export const Layout = Object.assign(LayoutRoot, {
  Header,
  Sider,
  Content,
  Footer,
});
