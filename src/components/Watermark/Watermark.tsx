import { useEffect, useRef, useState } from 'react';
import './Watermark.css';
import type { WatermarkProps } from './Watermark.types';

function generateWatermarkUrl({
  content,
  image,
  width = 120,
  height = 64,
  rotate = -22,
  font = {},
  gap = [100, 100],
}: WatermarkProps): Promise<string> {
  const {
    color = 'rgba(0,0,0,0.15)',
    fontSize = 14,
    fontFamily = 'sans-serif',
    fontStyle = 'normal',
    fontWeight = 'normal',
  } = font;

  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  const totalW = (width + gap[0]) * dpr;
  const totalH = (height + gap[1]) * dpr;
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;

  ctx.save();
  ctx.translate(totalW / 2, totalH / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize * dpr}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (image) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, -width * dpr / 2, -height * dpr / 2, width * dpr, height * dpr);
        ctx.restore();
        resolve(canvas.toDataURL());
      };
      img.onerror = () => { ctx.restore(); resolve(canvas.toDataURL()); };
      img.src = image;
    });
  }

  const lines = Array.isArray(content) ? content : content ? [content] : ['Watermark'];
  const lineH = fontSize * dpr * 1.4;
  const startY = -(lines.length - 1) * lineH / 2;
  lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lineH));
  ctx.restore();
  return Promise.resolve(canvas.toDataURL());
}

export function Watermark({
  content,
  image,
  width = 120,
  height = 64,
  rotate = -22,
  zIndex = 9,
  gap = [100, 100],
  offset,
  font,
  children,
  className = '',
  style,
}: WatermarkProps) {
  const [bgUrl, setBgUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateWatermarkUrl({ content, image, width, height, rotate, font, gap }).then(setBgUrl);
  }, [JSON.stringify({ content, image, width, height, rotate, font, gap })]);

  const offsetStyle: React.CSSProperties = offset
    ? { backgroundPosition: `${offset[0]}px ${offset[1]}px` }
    : {};

  return (
    <div
      ref={containerRef}
      className={['orot-watermark', className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
      {bgUrl && (
        <div
          className="orot-watermark__overlay"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: `${width + gap[0]}px ${height + gap[1]}px`,
            zIndex,
            ...offsetStyle,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
