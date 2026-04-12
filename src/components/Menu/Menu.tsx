import { useState, useEffect, useRef } from 'react';
import './Menu.css';
import type { MenuProps, MenuItemType, MenuClickInfo } from './Menu.types';

interface MenuItemProps {
  item: MenuItemType;
  depth: number;
  keyPath: string[];
  selectedKeys: string[];
  openKeys: string[];
  mode: 'vertical' | 'horizontal' | 'inline';
  inlineIndent: number;
  inlineCollapsed: boolean;
  onItemClick: (info: MenuClickInfo) => void;
  onSubmenuToggle: (key: string) => void;
}

function getItemTitle(item: MenuItemType): string | undefined {
  if (typeof item.label === 'string') return item.label;
  return undefined;
}

function MenuItem({
  item,
  depth,
  keyPath,
  selectedKeys,
  openKeys,
  mode,
  inlineIndent,
  inlineCollapsed,
  onItemClick,
  onSubmenuToggle,
}: MenuItemProps) {
  const submenuRef = useRef<HTMLLIElement>(null);

  if (item.type === 'divider') {
    return <li className="orot-menu__divider" role="separator" />;
  }

  if (item.type === 'group') {
    return (
      <li className="orot-menu__group">
        {!inlineCollapsed && (
          <div className="orot-menu__group-title">{item.label}</div>
        )}
        <ul
          className="orot-menu__submenu-list"
          role="group"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          {item.children?.map((child) => (
            <MenuItem
              key={child.key}
              item={child}
              depth={depth + 1}
              keyPath={[child.key, ...keyPath]}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              mode={mode}
              inlineIndent={inlineIndent}
              inlineCollapsed={inlineCollapsed}
              onItemClick={onItemClick}
              onSubmenuToggle={onSubmenuToggle}
            />
          ))}
        </ul>
      </li>
    );
  }

  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedKeys.includes(item.key);
  const isOpen = openKeys.includes(item.key);
  const isHorizontal = mode === 'horizontal';
  const titleAttr = inlineCollapsed ? getItemTitle(item) : undefined;

  if (hasChildren) {
    return (
      <li
        ref={submenuRef}
        className={[
          'orot-menu__submenu',
          isOpen && 'orot-menu__submenu--open',
          item.disabled && 'orot-menu__submenu--disabled',
          isHorizontal && 'orot-menu__submenu--horizontal',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className="orot-menu__submenu-title"
          style={
            mode === 'inline' && depth > 0
              ? { paddingLeft: `${depth * inlineIndent + inlineIndent}px` }
              : undefined
          }
          onClick={() => !item.disabled && onSubmenuToggle(item.key)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          role="button"
          tabIndex={0}
          title={titleAttr}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
              e.preventDefault();
              onSubmenuToggle(item.key);
            }
          }}
        >
          {item.icon && (
            <span className="orot-menu__item-icon">{item.icon}</span>
          )}
          {!inlineCollapsed && (
            <span className="orot-menu__item-label">{item.label}</span>
          )}
          {!inlineCollapsed && (
            <span className="orot-menu__submenu-arrow">
              {isHorizontal ? '▾' : isOpen ? '▾' : '›'}
            </span>
          )}
        </div>

        {/* horizontal 모드: 절대 위치 드롭다운, inline 모드: 인라인 확장 */}
        {isOpen && !inlineCollapsed && (
          <ul
            className={[
              'orot-menu__submenu-list',
              isHorizontal && 'orot-menu__submenu-list--popup',
            ]
              .filter(Boolean)
              .join(' ')}
            role="menu"
          >
            {item.children!.map((child) => (
              <MenuItem
                key={child.key}
                item={child}
                depth={depth + 1}
                keyPath={[child.key, ...keyPath]}
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                mode={mode}
                inlineIndent={inlineIndent}
                inlineCollapsed={inlineCollapsed}
                onItemClick={onItemClick}
                onSubmenuToggle={onSubmenuToggle}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li
      role="menuitem"
      aria-selected={isSelected}
      aria-disabled={item.disabled}
      className={[
        'orot-menu__item',
        isSelected && 'orot-menu__item--selected',
        item.disabled && 'orot-menu__item--disabled',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="orot-menu__item-inner"
        style={
          mode === 'inline' && depth > 0
            ? { paddingLeft: `${depth * inlineIndent + inlineIndent}px` }
            : undefined
        }
        title={titleAttr}
        onClick={() => {
          if (item.disabled) return;
          onItemClick({ key: item.key, keyPath });
        }}
        tabIndex={item.disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
            e.preventDefault();
            onItemClick({ key: item.key, keyPath });
          }
        }}
      >
        {item.icon && (
          <span className="orot-menu__item-icon">{item.icon}</span>
        )}
        {!inlineCollapsed && (
          <span className="orot-menu__item-label">{item.label}</span>
        )}
        {/* icon 없이 collapsed인 경우 첫 글자 fallback */}
        {inlineCollapsed && !item.icon && (
          <span className="orot-menu__item-label orot-menu__item-label--collapsed-fallback">
            {typeof item.label === 'string' ? item.label.charAt(0) : '·'}
          </span>
        )}
      </div>
    </li>
  );
}

export function Menu({
  items,
  mode = 'vertical',
  theme = 'light',
  selectedKeys: controlledSelected,
  defaultSelectedKeys = [],
  openKeys: controlledOpen,
  defaultOpenKeys = [],
  inlineCollapsed = false,
  inlineIndent = 16,
  selectable = true,
  multiple = false,
  onClick,
  onSelect,
  onDeselect,
  onOpenChange,
  className = '',
  style,
  ...rest
}: MenuProps) {
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelectedKeys);
  const [internalOpen, setInternalOpen] =
    useState<string[]>(defaultOpenKeys);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedKeys = controlledSelected ?? internalSelected;
  const openKeys = controlledOpen ?? internalOpen;

  // horizontal 모드: 외부 클릭 시 열린 submenu 닫기
  useEffect(() => {
    if (mode !== 'horizontal') return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (controlledOpen === undefined) setInternalOpen([]);
        onOpenChange?.([]);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mode, controlledOpen, onOpenChange]);

  const handleItemClick = (info: MenuClickInfo) => {
    if (selectable) {
      const wasSelected = selectedKeys.includes(info.key);
      const nextSelectedKeys = multiple
        ? wasSelected
          ? selectedKeys.filter((key) => key !== info.key)
          : [...selectedKeys, info.key]
        : [info.key];

      if (controlledSelected === undefined) {
        setInternalSelected(nextSelectedKeys);
      }

      if (multiple && wasSelected) {
        onDeselect?.(info);
      } else {
        onSelect?.(info);
      }
    }

    // horizontal 모드에서 아이템 클릭 시 submenu 닫기
    if (mode === 'horizontal') {
      if (controlledOpen === undefined) setInternalOpen([]);
      onOpenChange?.([]);
    }

    onClick?.(info);
  };

  const handleSubmenuToggle = (key: string) => {
    let next: string[];

    if (mode === 'horizontal') {
      // horizontal 모드: 하나만 열림 (아코디언)
      next = openKeys.includes(key) ? [] : [key];
    } else {
      next = openKeys.includes(key)
        ? openKeys.filter((k) => k !== key)
        : [...openKeys, key];
    }

    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const cls = [
    'orot-menu',
    `orot-menu--${mode}`,
    `orot-menu--theme-${theme}`,
    inlineCollapsed && 'orot-menu--collapsed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul ref={menuRef} role="menu" className={cls} style={style} {...rest}>
      {items.map((item) => (
        <MenuItem
          key={item.key}
          item={item}
          depth={0}
          keyPath={[item.key]}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          mode={mode}
          inlineIndent={inlineIndent}
          inlineCollapsed={inlineCollapsed}
          onItemClick={handleItemClick}
          onSubmenuToggle={handleSubmenuToggle}
        />
      ))}
    </ul>
  );
}
