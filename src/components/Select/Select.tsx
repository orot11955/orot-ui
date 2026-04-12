import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Select.css';
import type { SelectOption, SelectProps } from './Select.types';

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placement: 'bottom' | 'top';
}

export function Select({
  options,
  value: controlledValue,
  defaultValue,
  mode,
  showSearch = false,
  allowClear = false,
  loading = false,
  disabled = false,
  placeholder = 'Select...',
  size = 'md',
  status,
  name,
  filterOption = true,
  optionFilterProp = 'label',
  notFoundContent = 'No options',
  onOpenChange,
  onSearch,
  onChange,
  className = '',
  style,
  ...rest
}: SelectProps) {
  const isMultiple = mode === 'multiple';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const [internalValue, setInternalValue] = useState<(string | number)[]>(() => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedArr: (string | number)[] =
    controlledValue !== undefined
      ? Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue]
      : internalValue;

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 240;
    const placement = spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

    setDropdownPos({
      top: placement === 'bottom' ? rect.bottom + 4 : rect.top - 4,
      left: rect.left,
      width: rect.width,
      placement,
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleClose = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const dropdown = document.querySelector('.orot-select__dropdown-portal');
        if (dropdown && dropdown.contains(event.target as Node)) return;
        setDropdownOpen(false);
      }
    };

    const handleScroll = () => updateDropdownPosition();

    document.addEventListener('mousedown', handleClose);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClose);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open]);

  const setDropdownOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setSearch('');
      setActiveIndex(-1);
      setDropdownPos(null);
    } else {
      updateDropdownPosition();
    }
  };

  const setSelected = (nextValues: (string | number)[]) => {
    if (controlledValue === undefined) setInternalValue(nextValues);
    onChange?.(isMultiple ? nextValues : nextValues[0]);
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    onSearch?.(nextSearch);
  };

  const toggleOption = (value: string | number) => {
    if (isMultiple) {
      const nextValues = selectedArr.includes(value)
        ? selectedArr.filter((item) => item !== value)
        : [...selectedArr, value];
      setSelected(nextValues);
      setSearch('');
      return;
    }

    setSelected([value]);
    setDropdownOpen(false);
  };

  const removeTag = (value: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelected(selectedArr.filter((item) => item !== value));
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (controlledValue === undefined) setInternalValue([]);
    onChange?.(isMultiple ? [] : undefined);
  };

  const matchesOption = (option: SelectOption) => {
    if (!showSearch || !search) return true;
    if (typeof filterOption === 'function') return filterOption(search, option);
    if (filterOption === false) return true;

    const target = optionFilterProp === 'value' ? String(option.value) : option.label;
    return target.toLowerCase().includes(search.toLowerCase());
  };

  const filteredOptions = options.filter(matchesOption);
  const enabledOptions = filteredOptions.filter((option) => !option.disabled);

  useEffect(() => {
    if (!open) return;

    const selectedIndex = filteredOptions.findIndex(
      (option) => selectedArr.includes(option.value) && !option.disabled,
    );
    const fallbackIndex = filteredOptions.findIndex((option) => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : fallbackIndex);
  }, [filteredOptions, open, selectedArr]);

  const getLabel = (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value);

  const moveActiveIndex = (direction: 1 | -1) => {
    if (enabledOptions.length === 0) return;

    const currentOption = filteredOptions[activeIndex];
    const currentEnabledIndex = currentOption
      ? enabledOptions.findIndex((option) => option.value === currentOption.value)
      : -1;
    const nextEnabledIndex = currentEnabledIndex < 0
      ? direction === 1 ? 0 : enabledOptions.length - 1
      : (currentEnabledIndex + direction + enabledOptions.length) % enabledOptions.length;
    const nextOption = enabledOptions[nextEnabledIndex];
    const nextIndex = filteredOptions.findIndex((option) => option.value === nextOption.value);
    setActiveIndex(nextIndex);
  };

  const handleInteractiveKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) {
        setDropdownOpen(true);
        return;
      }
      moveActiveIndex(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setDropdownOpen(true);
        return;
      }
      moveActiveIndex(-1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!open) {
        setDropdownOpen(true);
        return;
      }

      const activeOption = filteredOptions[activeIndex];
      if (activeOption && !activeOption.disabled) {
        toggleOption(activeOption.value);
      }
      return;
    }

    if (event.key === 'Escape') {
      setDropdownOpen(false);
      return;
    }

    if (isMultiple && event.key === 'Backspace' && search.length === 0 && selectedArr.length > 0) {
      setSelected(selectedArr.slice(0, -1));
    }
  };

  const cls = [
    'orot-select',
    `orot-select--${size}`,
    open && 'orot-select--open',
    disabled && 'orot-select--disabled',
    loading && 'orot-select--loading',
    status && `orot-select--${status}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const dropdown = open && dropdownPos && (
    <div
      className={[
        'orot-select__dropdown',
        'orot-select__dropdown-portal',
        dropdownPos.placement === 'top' && 'orot-select__dropdown--top',
      ].filter(Boolean).join(' ')}
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
      {loading ? (
        <div className="orot-select__empty">Loading...</div>
      ) : filteredOptions.length === 0 ? (
        <div className="orot-select__empty">{notFoundContent}</div>
      ) : (
        filteredOptions.map((option, index) => {
          const isSelected = selectedArr.includes(option.value);
          return (
            <div
              key={option.value}
              id={`orot-select-option-${index}`}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled}
              className={[
                'orot-select__option',
                activeIndex === index && 'orot-select__option--active',
                isSelected && 'orot-select__option--selected',
                option.disabled && 'orot-select__option--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => !option.disabled && toggleOption(option.value)}
            >
              {option.label}
              {isSelected && isMultiple && (
                <span className="orot-select__option-check">✓</span>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div ref={containerRef} className={cls} style={style} {...rest}>
      {name && selectedArr.map((value) => (
        <input
          key={value}
          type="hidden"
          name={name}
          value={String(value)}
        />
      ))}
      <div
        className="orot-select__selector"
        onClick={() => !disabled && setDropdownOpen(!open)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={open}
        aria-disabled={disabled}
        aria-activedescendant={activeIndex >= 0 ? `orot-select-option-${activeIndex}` : undefined}
        onKeyDown={(event) => {
          if (event.key === ' ') {
            event.preventDefault();
            if (!open) {
              setDropdownOpen(true);
              return;
            }
          }

          handleInteractiveKeyDown(event);
        }}
      >
        {isMultiple ? (
          <>
            {selectedArr.length > 0 ? (
              selectedArr.map((value) => (
                <span key={value} className="orot-select__tag">
                  {getLabel(value)}
                  <button
                    type="button"
                    className="orot-select__tag-remove"
                    onClick={(event) => removeTag(value, event)}
                    tabIndex={-1}
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : !showSearch || !open ? (
              <span className="orot-select__placeholder">{placeholder}</span>
            ) : null}
            {showSearch && open && (
              <input
                autoFocus
                className="orot-select__search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={handleInteractiveKeyDown}
                placeholder={selectedArr.length > 0 ? '' : placeholder}
              />
            )}
          </>
        ) : showSearch && open ? (
          <input
            autoFocus
            className="orot-select__search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleInteractiveKeyDown}
            placeholder={selectedArr.length > 0 ? getLabel(selectedArr[0]) : placeholder}
          />
        ) : selectedArr.length > 0 ? (
          <span className="orot-select__value">{getLabel(selectedArr[0])}</span>
        ) : (
          <span className="orot-select__placeholder">{placeholder}</span>
        )}

        {allowClear && selectedArr.length > 0 && !disabled && (
          <button type="button" className="orot-select__clear" onClick={handleClear} tabIndex={-1}>
            ✕
          </button>
        )}
        <span className="orot-select__arrow">▾</span>
      </div>

      {typeof document !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  );
}
