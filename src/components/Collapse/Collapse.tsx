import { useState } from 'react';
import './Collapse.css';
import type { CollapseProps } from './Collapse.types';

export function Collapse({
  items,
  activeKey: controlledKey,
  defaultActiveKey = [],
  accordion = false,
  bordered = true,
  ghost = false,
  size = 'md',
  collapsible = 'header',
  destroyOnHidden = true,
  expandIconPosition = 'start',
  onChange,
  className = '',
  style,
  ...rest
}: CollapseProps) {
  const normalizeKeys = (k: string | string[] | undefined): string[] => {
    if (k === undefined) return [];
    return Array.isArray(k) ? k : [k];
  };

  const [internalKeys, setInternalKeys] = useState<string[]>(
    normalizeKeys(defaultActiveKey)
  );

  const activeKeys = controlledKey !== undefined ? normalizeKeys(controlledKey) : internalKeys;

  const toggle = (key: string) => {
    let next: string[];
    if (accordion) {
      next = activeKeys.includes(key) ? [] : [key];
    } else {
      next = activeKeys.includes(key)
        ? activeKeys.filter((k) => k !== key)
        : [...activeKeys, key];
    }
    if (controlledKey === undefined) setInternalKeys(next);
    onChange?.(next);
  };

  const cls = [
    'orot-collapse',
    bordered && 'orot-collapse--bordered',
    ghost && 'orot-collapse--ghost',
    `orot-collapse--${size}`,
    `orot-collapse--icon-${expandIconPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      {items.map((item) => {
        const isOpen = activeKeys.includes(item.key);
        const resolvedCollapsible = item.collapsible ?? collapsible;
        const isDisabled = item.disabled || resolvedCollapsible === 'disabled';
        return (
          <div
            key={item.key}
            className={[
              'orot-collapse__panel',
              isOpen && 'orot-collapse__panel--open',
              isDisabled && 'orot-collapse__panel--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <button
              type="button"
              className="orot-collapse__header"
              onClick={() => !isDisabled && toggle(item.key)}
              aria-expanded={isOpen}
              disabled={isDisabled}
            >
              {expandIconPosition === 'start' && (
                <span className="orot-collapse__arrow">▶</span>
              )}
              <span className="orot-collapse__title">{item.label}</span>
              {item.extra && (
                <span className="orot-collapse__extra">{item.extra}</span>
              )}
              {expandIconPosition === 'end' && (
                <span className="orot-collapse__arrow">▶</span>
              )}
            </button>
            {(!destroyOnHidden || isOpen) && (
              <div className="orot-collapse__content">{item.children}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
