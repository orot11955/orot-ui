import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './AutoComplete.css';
import type { AutoCompleteOption, AutoCompleteProps } from './AutoComplete.types';

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placement: 'bottom' | 'top';
}

export function AutoComplete({
  options = [],
  value: controlledValue,
  defaultValue = '',
  placeholder,
  disabled = false,
  allowClear = false,
  status,
  size = 'md',
  filterOption = true,
  notFoundContent,
  onSelect,
  onChange,
  onSearch,
  onOpenChange,
  className = '',
  style,
}: AutoCompleteProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 256;
    const placement = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

    setDropdownPos({
      top: placement === 'bottom' ? rect.bottom + 4 : rect.top - 4,
      left: rect.left,
      width: rect.width,
      placement,
    });
  }, []);

  const setDropdownOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setActiveIndex(-1);
      setDropdownPos(null);
    } else {
      updateDropdownPosition();
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e: MouseEvent) => {
      const dropdownEl = document.querySelector('.orot-autocomplete__dropdown-portal');
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(dropdownEl && dropdownEl.contains(e.target as Node))
      ) {
        setDropdownOpen(false);
      }
    };
    const handleScroll = () => updateDropdownPosition();

    document.addEventListener('mousedown', handler);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open]);

  const matchOption = (option: AutoCompleteOption): boolean => {
    if (!value) return true;
    if (filterOption === false) return true;
    if (typeof filterOption === 'function') return filterOption(value, option);
    return option.value.toLowerCase().includes(value.toLowerCase());
  };

  const filtered = options.filter(matchOption);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    onSearch?.(next);
    setDropdownOpen(true);
    setActiveIndex(-1);
  };

  const handleSelect = (option: AutoCompleteOption) => {
    setValue(option.value);
    onSelect?.(option.value, option);
    setDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setDropdownOpen(true); return; }
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const affixCls = [
    'orot-autocomplete__affix',
    `orot-autocomplete__affix--${size}`,
    status && `orot-autocomplete__affix--${status}`,
    disabled && 'orot-autocomplete__affix--disabled',
    open && 'orot-autocomplete__affix--open',
  ].filter(Boolean).join(' ');

  const dropdownNode = open && dropdownPos && (
    <div
      className="orot-autocomplete__dropdown orot-autocomplete__dropdown-portal"
      role="listbox"
      style={{
        position: 'fixed',
        top: dropdownPos.placement === 'bottom' ? dropdownPos.top : undefined,
        bottom: dropdownPos.placement === 'top' ? `calc(100vh - ${dropdownPos.top}px)` : undefined,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 'var(--orot-z-dropdown)' as unknown as number,
      }}
    >
      {filtered.length === 0
        ? notFoundContent && <div className="orot-autocomplete__empty">{notFoundContent}</div>
        : filtered.map((option, idx) => (
          <div
            key={option.value}
            role="option"
            aria-selected={activeIndex === idx}
            aria-disabled={option.disabled}
            className={[
              'orot-autocomplete__option',
              activeIndex === idx && 'orot-autocomplete__option--active',
              option.disabled && 'orot-autocomplete__option--disabled',
            ].filter(Boolean).join(' ')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => !option.disabled && handleSelect(option)}
            onMouseEnter={() => setActiveIndex(idx)}
          >
            {option.label ?? option.value}
          </div>
        ))
      }
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={['orot-autocomplete', className].filter(Boolean).join(' ')}
      style={style}
    >
      <span className={affixCls}>
        <input
          className="orot-autocomplete__input"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
        {allowClear && value && !disabled && (
          <button
            type="button"
            className="orot-autocomplete__clear"
            onClick={() => { setValue(''); setDropdownOpen(false); }}
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </span>

      {typeof document !== 'undefined' && createPortal(dropdownNode, document.body)}
    </div>
  );
}
