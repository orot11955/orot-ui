import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './ColorPicker.css';
import type { ColorPickerProps } from './ColorPicker.types';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#1677ff',
  disabled = false,
  allowClear = false,
  showText = false,
  size = 'md',
  open: controlledOpen,
  onOpenChange,
  onChange,
  onClear,
  presets,
  className = '',
  style,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    if (!next) setPos(null);
    onOpenChange?.(next);
  };

  const setValue = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const updatePos = () => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        panelRef.current && !panelRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v.match(/^#[0-9a-fA-F]{6}$/)) setValue(v);
  };

  return (
    <div
      ref={containerRef}
      className={['orot-color-picker', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        className={[
          'orot-color-picker__trigger',
          `orot-color-picker__trigger--${size}`,
          disabled && 'orot-color-picker__trigger--disabled',
          open && 'orot-color-picker__trigger--open',
        ].filter(Boolean).join(' ')}
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="orot-color-picker__swatch" style={{ background: value }} />
        {showText && <span className="orot-color-picker__text">{value}</span>}
        {allowClear && (
          <span
            className="orot-color-picker__clear"
            role="button"
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); setValue('transparent'); onClear?.(); }}
          >
            ✕
          </span>
        )}
      </button>

      {typeof document !== 'undefined' && createPortal(
        open && pos ? (
        <div
          ref={panelRef}
          className="orot-color-picker__panel"
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 'var(--orot-z-dropdown)' as unknown as number }}
        >
          {/* Gradient picker area */}
          <div
            className="orot-color-picker__gradient"
            style={{ background: `linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))` }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const hue = ((e.clientX - rect.left) / rect.width) * 360;
              const r2 = Math.round(255 * Math.max(0, Math.min(1, Math.abs(((hue / 60) % 6) - 3) - 1)));
              const g2 = Math.round(255 * Math.max(0, Math.min(1, 2 - Math.abs(((hue / 60) % 6) - 2))));
              const b2 = Math.round(255 * Math.max(0, Math.min(1, 2 - Math.abs(((hue / 60) % 6) - 4))));
              setValue(rgbToHex(r2, g2, b2));
            }}
          />

          <div className="orot-color-picker__inputs">
            <label className="orot-color-picker__label">HEX</label>
            <input
              className="orot-color-picker__hex-input"
              defaultValue={value}
              onBlur={handleHexInput}
              maxLength={7}
              spellCheck={false}
            />
            <input
              type="color"
              className="orot-color-picker__native"
              value={value.startsWith('#') && value.length === 7 ? value : '#1677ff'}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {presets && presets.map((group, i) => (
            <div key={i} className="orot-color-picker__presets">
              <div className="orot-color-picker__presets-label">{group.label}</div>
              <div className="orot-color-picker__presets-colors">
                {group.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={['orot-color-picker__preset-dot', c === value && 'orot-color-picker__preset-dot--active'].filter(Boolean).join(' ')}
                    style={{ background: c }}
                    onClick={() => setValue(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        ) : null,
        document.body,
      )}
    </div>
  );
}
