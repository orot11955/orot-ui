import type { ReactNode } from 'react';

export interface SlashMenuItem {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
  keywords?: string[];
}

interface SlashMenuProps {
  items: SlashMenuItem[];
  activeIndex: number;
  top: number;
  left: number;
  onSelect: (id: string) => void;
  onHoverIndex: (index: number) => void;
}

export function SlashMenu({
  items,
  activeIndex,
  top,
  left,
  onSelect,
  onHoverIndex,
}: SlashMenuProps) {
  if (items.length === 0) {
    return (
      <div
        className="orot-md-slash-menu orot-md-slash-menu--empty"
        role="listbox"
        aria-label="Slash commands"
        style={{ top, left }}
      >
        <div className="orot-md-slash-empty">No matching commands</div>
      </div>
    );
  }

  return (
    <div
      className="orot-md-slash-menu"
      role="listbox"
      aria-label="Slash commands"
      style={{ top, left }}
    >
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          role="option"
          aria-selected={i === activeIndex}
          className={[
            'orot-md-slash-item',
            i === activeIndex && 'orot-md-slash-item--active',
          ]
            .filter(Boolean)
            .join(' ')}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item.id);
          }}
          onMouseEnter={() => onHoverIndex(i)}
        >
          <span className="orot-md-slash-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="orot-md-slash-body">
            <span className="orot-md-slash-label">{item.label}</span>
            {item.description && (
              <span className="orot-md-slash-desc">{item.description}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

export function filterSlashItems<T extends SlashMenuItem>(
  items: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    if (item.id.toLowerCase().includes(q)) return true;
    if (item.label.toLowerCase().includes(q)) return true;
    if (item.description?.toLowerCase().includes(q)) return true;
    return item.keywords?.some((kw) => kw.toLowerCase().includes(q)) ?? false;
  });
}
