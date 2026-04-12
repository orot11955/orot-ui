import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import './Dropdown.css';
import type { DropdownProps, DropdownItemType } from './Dropdown.types';

interface DropdownPosition {
  top: number;
  left: number;
  right?: number;
  width: number;
  placement: 'bottom' | 'top';
}

interface DropdownMenuProps {
  items: DropdownItemType[];
  placement: string;
  arrow: boolean;
  hidden?: boolean;
  popupStyle?: CSSProperties;
  onClose: () => void;
}

function DropdownMenu({
  items,
  placement,
  arrow,
  hidden = false,
  popupStyle,
  onClose,
}: DropdownMenuProps) {
  const renderItem = (item: DropdownItemType) => {
    if (item.type === 'divider') {
      return <li key={item.key} className="orot-dropdown__divider" />;
    }

    if (item.children && item.children.length > 0) {
      return (
        <li key={item.key} className="orot-dropdown__submenu">
          <div
            className={[
              'orot-dropdown__item',
              item.disabled && 'orot-dropdown__item--disabled',
              item.danger && 'orot-dropdown__item--danger',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {item.icon && <span className="orot-dropdown__item-icon">{item.icon}</span>}
            <span className="orot-dropdown__item-label">{item.label}</span>
            <span className="orot-dropdown__submenu-arrow">▶</span>
          </div>
          <ul className="orot-dropdown__submenu-list">
            {item.children.map(renderItem)}
          </ul>
        </li>
      );
    }

    return (
      <li
        key={item.key}
        className={[
          'orot-dropdown__item',
          item.disabled && 'orot-dropdown__item--disabled',
          item.danger && 'orot-dropdown__item--danger',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => {
          if (!item.disabled) {
            item.onClick?.(item.key);
            onClose();
          }
        }}
      >
        {item.icon && <span className="orot-dropdown__item-icon">{item.icon}</span>}
        <span className="orot-dropdown__item-label">{item.label}</span>
      </li>
    );
  };

  return (
    <ul
      hidden={hidden}
      style={popupStyle}
      className={[
        'orot-dropdown__menu',
        `orot-dropdown__menu--${placement}`,
        arrow && 'orot-dropdown__menu--arrow',
        hidden && 'orot-dropdown__menu--hidden',
        popupStyle?.position === 'fixed' && 'orot-dropdown__menu--context',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {items.map(renderItem)}
    </ul>
  );
}

export function Dropdown({
  items,
  menu,
  trigger = 'hover',
  placement = 'bottomLeft',
  open: controlledOpen,
  arrow = false,
  disabled = false,
  popupRender,
  destroyOnHidden = true,
  onOpenChange,
  children,
  className = '',
  style,
  ...rest
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [contextPosition, setContextPosition] = useState<{ x: number; y: number } | null>(null);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedItems = menu?.items ?? items ?? [];
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const hoverEnabled = triggers.includes('hover');
  const clickEnabled = triggers.includes('click');
  const contextEnabled = triggers.includes('contextMenu');

  const open = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (val: boolean) => {
      if (!val) setContextPosition(null);
      if (controlledOpen === undefined) setInternalOpen(val);
      onOpenChange?.(val);
    },
    [controlledOpen, onOpenChange]
  );

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 300;
    const placementV = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

    setDropdownPos({
      top: placementV === 'bottom' ? rect.bottom + 4 : rect.top - 4,
      left: rect.left,
      width: rect.width,
      placement: placementV,
    });
  }, []);

  // Close on outside click + reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const dropdownEl = document.querySelector('.orot-dropdown__menu-portal');
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(dropdownEl && dropdownEl.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    };
    const handleScroll = () => {
      if (!contextPosition) updateDropdownPosition();
    };

    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open, setOpen, contextPosition, updateDropdownPosition]);

  const hoverProps =
    hoverEnabled
      ? {
          onMouseEnter: () => {
            if (!disabled) {
              updateDropdownPosition();
              setOpen(true);
            }
          },
          onMouseLeave: () => setOpen(false),
        }
      : {};

  const clickProps =
    clickEnabled
      ? {
          onClick: () => {
            if (!disabled) {
              if (!open) updateDropdownPosition();
              setOpen(!open);
            }
          },
        }
      : {};

  const contextMenuProps =
    contextEnabled
      ? {
          onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
            if (disabled) return;
            event.preventDefault();
            setContextPosition({ x: event.clientX, y: event.clientY });
            setOpen(true);
          },
        }
      : {};

  // For context menu: use fixed position at cursor; for normal: use portal-positioned
  const resolvedPlacementV = dropdownPos
    ? dropdownPos.placement === 'top' ? (placement.replace('bottom', 'top') as typeof placement) : placement
    : placement;

  const popupStyle: CSSProperties | undefined = contextPosition
    ? {
        position: 'fixed' as const,
        left: `${contextPosition.x}px`,
        top: `${contextPosition.y}px`,
      }
    : dropdownPos
    ? {
        position: 'fixed' as const,
        top: dropdownPos.placement === 'bottom' ? `${dropdownPos.top}px` : undefined,
        bottom: dropdownPos.placement === 'top' ? `calc(100vh - ${dropdownPos.top}px)` : undefined,
        left: placement.endsWith('Right') ? undefined : `${dropdownPos.left}px`,
        right: placement.endsWith('Right')
          ? `${window.innerWidth - dropdownPos.left - dropdownPos.width}px`
          : undefined,
        minWidth: `${dropdownPos.width}px`,
        zIndex: 'var(--orot-z-dropdown)' as unknown as number,
      }
    : undefined;

  const shouldRender = open || !destroyOnHidden;

  const menuNode = shouldRender && !disabled ? (
    <DropdownMenu
      items={resolvedItems}
      placement={resolvedPlacementV}
      arrow={arrow && !contextPosition}
      hidden={!open}
      popupStyle={popupStyle}
      onClose={() => setOpen(false)}
    />
  ) : null;

  const portalContent = menuNode && (
    <div className="orot-dropdown__menu-portal">
      {popupRender ? popupRender(menuNode) : menuNode}
    </div>
  );

  const cls = ['orot-dropdown', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={cls}
      style={style}
      {...hoverProps}
      {...rest}
    >
      <div className="orot-dropdown__trigger" {...clickProps} {...contextMenuProps}>
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(portalContent, document.body)}
    </div>
  );
}
