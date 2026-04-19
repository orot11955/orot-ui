import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { OROT_UI_VERSION_LABEL } from '../config/site';
import { NAV_ITEMS } from '../config/navigation';
import './DocsLayout.css';

const THEMES = ['light', 'dark', 'sepia', 'forest', 'ocean'] as const;
type Theme = (typeof THEMES)[number];
const THEME_STORAGE_KEY = 'orot-ui-docs-theme';

const THEME_META: Record<Theme, { icon: string; label: string }> = {
  light: { icon: '', label: 'Light' },
  dark: { icon: '', label: 'Dark' },
  sepia: { icon: '', label: 'Sepia' },
  forest: { icon: '', label: 'Forest' },
  ocean: { icon: '', label: 'Ocean' },
};

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme && THEMES.includes(storedTheme as Theme)
      ? (storedTheme as Theme)
      : 'light';
  } catch {
    return 'light';
  }
}

interface ThemeToggleProps {
  theme: Theme;
  onCycle: () => void;
  onSelect: (t: Theme) => void;
}

function ThemeToggle({ theme, onCycle, onSelect }: ThemeToggleProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = THEME_META[theme];

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.docs-theme-toggle')) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div className="docs-theme-toggle">
      <button
        className="docs-theme-toggle__btn"
        onClick={onCycle}
        onContextMenu={(e) => { e.preventDefault(); setMenuOpen(v => !v); }}
        aria-label={`Current theme: ${meta.label}. Click to cycle, right-click to select.`}
        title={`Theme: ${meta.label}`}
      >
        <span className="docs-theme-toggle__icon">{meta.icon}</span>
        <span className="docs-theme-toggle__label">{meta.label}</span>
        <span
          className="docs-theme-toggle__arrow"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
        >▾</span>
      </button>
      {menuOpen && (
        <div className="docs-theme-toggle__menu">
          {THEMES.map(t => (
            <button
              key={t}
              className={`docs-theme-toggle__item${t === theme ? ' docs-theme-toggle__item--active' : ''}`}
              onClick={() => { onSelect(t); setMenuOpen(false); }}
            >
              <span className="docs-theme-toggle__item-icon">{THEME_META[t].icon}</span>
              <span>{THEME_META[t].label}</span>
              {t === theme && <span className="docs-theme-toggle__check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocsLayout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-orot-theme', theme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures and keep the in-memory theme.
    }
  }, [theme]);

  useEffect(() => {
    const syncViewport = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    document.body.style.overflow = isMobile && sidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(next);
  };

  return (
    <div className="docs-root" data-orot-theme={theme}>
      {/* Header */}
      <header className="docs-header">
        <div className="docs-header__left">
          <button
            className="docs-header__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="docs-sidebar"
          >
            ☰
          </button>
          <span
            className="docs-header__logo"
            onClick={() => navigate('/')}
          >
            orot-ui
          </span>
          <span className="docs-header__version">{OROT_UI_VERSION_LABEL}</span>
        </div>
        <div className="docs-header__right">
          <ThemeToggle
            theme={theme}
            onCycle={cycleTheme}
            onSelect={setTheme}
          />
        </div>
      </header>

      <div className="docs-body">
        {/* Sidebar */}
        <aside
          id="docs-sidebar"
          className={`docs-sidebar ${sidebarOpen ? 'docs-sidebar--open' : ''}`}
        >
          <nav className="docs-nav">
            {NAV_ITEMS.map((group) => (
              <div key={group.group} className="docs-nav__group">
                <div className="docs-nav__group-label">{group.group}</div>
                <ul className="docs-nav__list">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `docs-nav__link${isActive ? ' docs-nav__link--active' : ''}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <button
          className={`docs-sidebar-backdrop ${sidebarOpen ? 'docs-sidebar-backdrop--open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          tabIndex={sidebarOpen ? 0 : -1}
        />

        {/* Main content */}
        <main className="docs-main">
          <div className="docs-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
