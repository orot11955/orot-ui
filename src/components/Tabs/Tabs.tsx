import { useState, type KeyboardEvent } from 'react';
import './Tabs.css';
import type { TabsProps } from './Tabs.types';

export function Tabs({
  items,
  activeKey: controlledKey,
  defaultActiveKey,
  type = 'line',
  tabPosition,
  tabPlacement,
  centered = false,
  destroyOnHidden = false,
  onChange,
  className = '',
  style,
  ...rest
}: TabsProps) {
  // tabPlacement 우선, 그 다음 tabPosition, 기본값 'top'
  const resolvedPosition = tabPlacement ?? tabPosition ?? 'top';
  const [internalKey, setInternalKey] = useState<string>(
    defaultActiveKey ?? items[0]?.key ?? ''
  );

  const activeKey = controlledKey ?? internalKey;

  const activate = (key: string) => {
    if (controlledKey === undefined) setInternalKey(key);
    onChange?.(key);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate(key);
    }
  };

  const isVertical = resolvedPosition === 'left' || resolvedPosition === 'right';

  const cls = [
    'orot-tabs',
    `orot-tabs--${type}`,
    `orot-tabs--${resolvedPosition}`,
    isVertical && 'orot-tabs--vertical',
    centered && 'orot-tabs--centered',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const navCls = [
    'orot-tabs__nav',
    centered && 'orot-tabs__nav--centered',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} style={style} {...rest}>
      <div className={navCls} role="tablist">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            type="button"
            aria-selected={item.key === activeKey}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            className={[
              'orot-tabs__tab',
              item.key === activeKey && 'orot-tabs__tab--active',
              item.disabled && 'orot-tabs__tab--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => !item.disabled && activate(item.key)}
            onKeyDown={(e) => handleKeyDown(e, item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="orot-tabs__content">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          if (!isActive && destroyOnHidden) return null;
          return (
            <div
              key={item.key}
              role="tabpanel"
              hidden={!isActive}
              className={[
                'orot-tabs__panel',
                isActive && 'orot-tabs__panel--active',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {item.children}
            </div>
          );
        })}
      </div>
    </div>
  );
}
