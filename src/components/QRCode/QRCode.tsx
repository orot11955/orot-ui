import { useEffect, useRef } from 'react';
import './QRCode.css';
import type { QRCodeProps } from './QRCode.types';

/**
 * Minimal QR code renderer using a simple pattern visualisation.
 * For production use, integrate a library like `qrcode` or `qr-code-styling`.
 * This implementation renders a visual placeholder that shows the URL concept.
 */
function drawQR(canvas: HTMLCanvasElement, value: string, size: number, color: string, bgColor: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // Simple deterministic pixel pattern based on string hash
  const cells = 21;
  const cellSize = size / cells;

  const hash = (s: string) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return h >>> 0;
  };

  ctx.fillStyle = color;

  // Draw finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (ox: number, oy: number) => {
    ctx.fillRect(ox * cellSize, oy * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = bgColor;
    ctx.fillRect((ox + 1) * cellSize, (oy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = color;
    ctx.fillRect((ox + 2) * cellSize, (oy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  drawFinder(0, 0);
  drawFinder(cells - 7, 0);
  drawFinder(0, cells - 7);

  // Fill data area with deterministic pattern
  const h = hash(value);
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      // Skip finder patterns
      if ((row < 8 && col < 8) || (row < 8 && col > cells - 9) || (row > cells - 9 && col < 8)) continue;

      const bit = (hash(value + row * 31 + col * 17) ^ (row * col + h)) & 1;
      if (bit) {
        ctx.fillStyle = color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

export function QRCode({
  value,
  size = 160,
  color,
  bgColor,
  bordered = true,
  status = 'active',
  icon,
  iconSize,
  onRefresh,
  className = '',
  style,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || status !== 'active') return;
    const el = containerRef.current ?? canvasRef.current;
    const cs = getComputedStyle(el);
    const resolvedColor = color ?? (cs.getPropertyValue('--orot-color-text').trim() || '#000000');
    const resolvedBg = bgColor ?? (cs.getPropertyValue('--orot-color-bg-container').trim() || '#ffffff');
    drawQR(canvasRef.current, value, size, resolvedColor, resolvedBg);
  }, [value, size, color, bgColor, status]);

  return (
    <div
      ref={containerRef}
      className={[
        'orot-qrcode',
        bordered && 'orot-qrcode--bordered',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="orot-qrcode__canvas-wrap" style={{ width: size, height: size }}>
        <canvas ref={canvasRef} className="orot-qrcode__canvas" />

        {status === 'loading' && (
          <div className="orot-qrcode__overlay">
            <span className="orot-qrcode__spin" />
          </div>
        )}

        {status === 'expired' && (
          <div className="orot-qrcode__overlay orot-qrcode__overlay--expired">
            <span className="orot-qrcode__expired-text">Expired</span>
            {onRefresh && (
              <button type="button" className="orot-qrcode__refresh" onClick={onRefresh}>
                Refresh
              </button>
            )}
          </div>
        )}

        {status === 'scanned' && (
          <div className="orot-qrcode__overlay orot-qrcode__overlay--scanned">
            <span className="orot-qrcode__scanned-icon">✓</span>
            <span className="orot-qrcode__scanned-text">Scanned</span>
          </div>
        )}

        {icon && status === 'active' && (
          <img
            src={icon}
            alt="QR icon"
            className="orot-qrcode__icon"
            style={{ width: iconSize ?? size * 0.2, height: iconSize ?? size * 0.2 }}
          />
        )}
      </div>
    </div>
  );
}
