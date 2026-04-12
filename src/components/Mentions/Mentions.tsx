import { useEffect, useRef, useState } from 'react';
import './Mentions.css';
import type { MentionOption, MentionsProps } from './Mentions.types';

export function Mentions({
  options = [],
  prefix = '@',
  value: controlledValue,
  defaultValue = '',
  placeholder,
  rows = 3,
  disabled = false,
  allowClear = false,
  status = '',
  split = ' ',
  onChange,
  onSelect,
  onSearch,
  className = '',
  style,
}: MentionsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;

  const [open, setOpen] = useState(false);
  const [activePrefix, setActivePrefix] = useState('');
  const [searchText, setSearchText] = useState('');
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const [activeIdx, setActiveIdx] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prefixes = Array.isArray(prefix) ? prefix : [prefix];

  const filteredOptions = options.filter((o) =>
    (o.label ?? o.value).toLowerCase().includes(searchText.toLowerCase()),
  );

  const updateValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    updateValue(text);

    const ta = textareaRef.current;
    if (!ta) return;

    const cursor = ta.selectionStart ?? text.length;
    const before = text.slice(0, cursor);

    let triggered = false;
    for (const p of prefixes) {
      const idx = before.lastIndexOf(p);
      if (idx !== -1) {
        const after = before.slice(idx + p.length);
        if (!after.includes(' ') && !after.includes('\n')) {
          setActivePrefix(p);
          setSearchText(after);
          setOpen(true);
          setActiveIdx(0);
          onSearch?.(after, p);
          triggered = true;

          // 드롭다운 위치 계산 (간이)
          const lineHeight = parseInt(getComputedStyle(ta).lineHeight || '20');
          const lines = before.split('\n').length;
          setDropPos({ top: Math.min(lines * lineHeight, ta.offsetHeight), left: 0 });
          break;
        }
      }
    }
    if (!triggered) setOpen(false);
  };

  const selectOption = (opt: MentionOption) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const cursor = ta.selectionStart ?? value.length;
    const before = value.slice(0, cursor);
    const idx = before.lastIndexOf(activePrefix);
    const after = value.slice(cursor);
    const next = before.slice(0, idx) + activePrefix + opt.value + split + after;
    updateValue(next);
    onSelect?.(opt, activePrefix);
    setOpen(false);
    setTimeout(() => {
      const pos = idx + activePrefix.length + opt.value.length + split.length;
      ta.setSelectionRange(pos, pos);
      ta.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open || filteredOptions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      selectOption(filteredOptions[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cls = [
    'orot-mentions',
    status && `orot-mentions--${status}`,
    disabled && 'orot-mentions--disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={cls} style={style}>
      <div className="orot-mentions__wrap">
        <textarea
          ref={textareaRef}
          className="orot-mentions__textarea"
          value={value}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {allowClear && value && !disabled && (
          <button
            type="button"
            className="orot-mentions__clear"
            onClick={() => updateValue('')}
            aria-label="clear"
          >
            ✕
          </button>
        )}
      </div>
      {open && filteredOptions.length > 0 && (
        <ul
          className="orot-mentions__dropdown"
          style={{ top: dropPos.top, left: dropPos.left }}
          role="listbox"
        >
          {filteredOptions.map((opt, i) => (
            <li
              key={opt.value}
              className={['orot-mentions__option', i === activeIdx && 'orot-mentions__option--active'].filter(Boolean).join(' ')}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => { e.preventDefault(); selectOption(opt); }}
            >
              {opt.label ?? opt.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
