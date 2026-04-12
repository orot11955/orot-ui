import { useEffect, useRef, useState } from 'react';
import './Anchor.css';
import type { AnchorItem, AnchorProps } from './Anchor.types';

function flatItems(items: AnchorItem[]): AnchorItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flatItems(item.children) : [])]);
}

function AnchorLink({
  item,
  activeKey,
  onClick,
}: {
  item: AnchorItem;
  activeKey: string;
  onClick: (href: string, key: string) => void;
}) {
  const isActive = activeKey === item.key;
  return (
    <li className="orot-anchor__item">
      <a
        href={item.href}
        className={['orot-anchor__link', isActive && 'orot-anchor__link--active'].filter(Boolean).join(' ')}
        onClick={(e) => {
          e.preventDefault();
          onClick(item.href, item.key);
        }}
      >
        {item.title}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="orot-anchor__list orot-anchor__list--nested">
          {item.children.map((child) => (
            <AnchorLink key={child.key} item={child} activeKey={activeKey} onClick={onClick} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Anchor({
  items,
  affix = true,
  offsetTop = 0,
  bounds = 5,
  targetOffset,
  onChange,
  getCurrentAnchor,
  className = '',
  style,
}: AnchorProps) {
  const [activeKey, setActiveKey] = useState('');
  const scrollingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const flat = flatItems(items);

    const updateActive = () => {
      if (scrollingRef.current) return;
      if (getCurrentAnchor) {
        const key = getCurrentAnchor();
        if (key !== activeKey) {
          setActiveKey(key);
          onChange?.(key);
        }
        return;
      }
      const offset = targetOffset ?? offsetTop + bounds;
      let current = '';
      for (const item of flat) {
        const id = item.href.replace(/^#/, '');
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          current = item.key;
        }
      }
      if (current !== activeKey) {
        setActiveKey(current);
        onChange?.(current);
      }
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, [items, offsetTop, bounds, targetOffset, activeKey, getCurrentAnchor, onChange]);

  const handleClick = (href: string, key: string) => {
    const id = href.replace(/^#/, '');
    const el = document.getElementById(id);
    if (el) {
      scrollingRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      const top = el.getBoundingClientRect().top + window.scrollY - (targetOffset ?? offsetTop);
      window.scrollTo({ top, behavior: 'smooth' });
      timerRef.current = setTimeout(() => { scrollingRef.current = false; }, 600);
    }
    setActiveKey(key);
    onChange?.(key);
  };

  const cls = [
    'orot-anchor',
    affix && 'orot-anchor--affix',
    className,
  ].filter(Boolean).join(' ');

  const wrapStyle = affix
    ? ({ position: 'sticky', top: offsetTop, ...style } as React.CSSProperties)
    : style;

  return (
    <nav className={cls} style={wrapStyle} aria-label="page anchor navigation">
      <ul className="orot-anchor__list">
        {items.map((item) => (
          <AnchorLink key={item.key} item={item} activeKey={activeKey} onClick={handleClick} />
        ))}
      </ul>
    </nav>
  );
}
