import { Children, createContext, useContext, useEffect, useRef, useState } from 'react';
import './Image.css';
import type { ImageGroupProps, ImagePreviewConfig, ImageProps } from './Image.types';

/* ── Group context for shared preview ─────────────────────────── */
interface GroupCtx {
  register: (src: string) => number;
  open: (index: number) => void;
}
const GroupContext = createContext<GroupCtx | null>(null);

/* ── Preview overlay ───────────────────────────────────────────── */
function PreviewOverlay({
  src,
  onClose,
  srcs,
  index: initialIndex,
}: {
  src: string;
  onClose: () => void;
  srcs?: string[];
  index?: number;
}) {
  const [idx, setIdx] = useState(initialIndex ?? 0);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const list = srcs && srcs.length > 0 ? srcs : [src];
  const current = list[idx];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(list.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, list.length]);

  return (
    <div className="orot-image-preview" onClick={onClose} role="dialog" aria-modal="true">
      <div className="orot-image-preview__content" onClick={(e) => e.stopPropagation()}>
        <img
          src={current}
          alt="preview"
          className="orot-image-preview__img"
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
          draggable={false}
        />
      </div>
      {/* Controls */}
      <div className="orot-image-preview__toolbar" onClick={(e) => e.stopPropagation()}>
        <button className="orot-image-preview__btn" onClick={() => setScale((s) => Math.min(s + 0.25, 4))} title="확대">＋</button>
        <button className="orot-image-preview__btn" onClick={() => setScale((s) => Math.max(s - 0.25, 0.25))} title="축소">－</button>
        <button className="orot-image-preview__btn" onClick={() => setScale(1)} title="원래 크기">⊙</button>
        <button className="orot-image-preview__btn" onClick={() => setRotate((r) => r - 90)} title="좌회전">↺</button>
        <button className="orot-image-preview__btn" onClick={() => setRotate((r) => r + 90)} title="우회전">↻</button>
      </div>
      {/* Navigation */}
      {list.length > 1 && (
        <>
          <button
            className="orot-image-preview__nav orot-image-preview__nav--prev"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.max(0, i - 1)); }}
            disabled={idx === 0}
            aria-label="previous"
          >‹</button>
          <button
            className="orot-image-preview__nav orot-image-preview__nav--next"
            onClick={(e) => { e.stopPropagation(); setIdx((i) => Math.min(list.length - 1, i + 1)); }}
            disabled={idx === list.length - 1}
            aria-label="next"
          >›</button>
          <div className="orot-image-preview__counter">{idx + 1} / {list.length}</div>
        </>
      )}
      <button className="orot-image-preview__close" onClick={onClose} aria-label="close">✕</button>
    </div>
  );
}

/* ── Image root ─────────────────────────────────────────────────── */
function ImageRoot({
  src,
  alt = '',
  width,
  height,
  fallback,
  placeholder,
  preview = true,
  className = '',
  style,
  onError,
}: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [previewOpen, setPreviewOpen] = useState(false);
  const prevSrcRef = useRef<string | undefined>(undefined);

  const group = useContext(GroupContext);

  const previewConfig: ImagePreviewConfig | false =
    preview === false ? false : preview === true ? {} : preview;

  const isControlled = previewConfig !== false && previewConfig.open !== undefined;
  const open = isControlled ? previewConfig.open! : previewOpen;
  const setOpen = isControlled
    ? (v: boolean) => previewConfig.onOpenChange?.(v)
    : setPreviewOpen;

  // Only reset when src/fallback actually changes after initial mount
  useEffect(() => {
    if (prevSrcRef.current === undefined) {
      prevSrcRef.current = src;
      return;
    }
    prevSrcRef.current = src;
    setCurrentSrc(src);
    setStatus('loading');
  }, [src, fallback]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    onError?.(e);

    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
      setStatus('loading');
      return;
    }

    setStatus('error');
  };

  const handleLoad = () => setStatus('loaded');

  const handleClick = () => {
    if (preview === false) return;
    if (group) {
      group.open(group.register(src));
    } else {
      setOpen(true);
    }
  };

  const displaySrc = currentSrc;
  const previewSrc =
    previewConfig !== false && previewConfig.src ? previewConfig.src : displaySrc;

  const showMask = preview !== false && status === 'loaded' && Boolean(displaySrc);

  return (
    <>
      <span
        className={['orot-image', className].filter(Boolean).join(' ')}
        style={{ width, height, display: 'inline-block', position: 'relative', overflow: 'hidden', ...style }}
      >
        {/* Placeholder */}
        {status === 'loading' && placeholder && (
          <span className="orot-image__placeholder">
            {placeholder === true ? <span className="orot-image__placeholder-default" /> : placeholder}
          </span>
        )}
        <img
          src={displaySrc}
          alt={alt}
          width={width}
          height={height}
          className={['orot-image__img', status === 'loading' && 'orot-image__img--loading'].filter(Boolean).join(' ')}
          onLoad={handleLoad}
          onError={handleError}
          draggable={false}
        />
        {showMask && (
          <span className="orot-image__mask" onClick={handleClick} role="button" aria-label="preview">
            {previewConfig !== false && previewConfig.mask ? previewConfig.mask : (
              <span className="orot-image__mask-text">미리보기</span>
            )}
          </span>
        )}
      </span>
      {open && !group && (
        <PreviewOverlay src={previewSrc} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/* ── Image.Group ─────────────────────────────────────────────────── */
function ImageGroup({ children, preview = true }: ImageGroupProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // 그룹 내 이미지 src를 순서대로 수집하기 위해 children에서 src 추출
  const childSrcs: string[] = [];
  Children.forEach(children, (child) => {
    if (child && typeof child === 'object' && 'props' in child) {
      childSrcs.push((child as { props: { src?: string } }).props.src ?? '');
    }
  });

  const ctx: GroupCtx = {
    register: (src) => {
      const i = childSrcs.indexOf(src);
      return i >= 0 ? i : 0;
    },
    open: (index) => {
      if (!preview) return;
      setPreviewIndex(index);
      setPreviewOpen(true);
    },
  };

  return (
    <GroupContext.Provider value={ctx}>
      {children}
      {previewOpen && (
        <PreviewOverlay
          src={childSrcs[previewIndex] ?? ''}
          srcs={childSrcs}
          index={previewIndex}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </GroupContext.Provider>
  );
}

export const Image = Object.assign(ImageRoot, { Group: ImageGroup });
