import { Children, useEffect, useRef, useState } from 'react';
import './Carousel.css';
import type { CarouselProps } from './Carousel.types';

export function Carousel({
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  dotPosition = 'bottom',
  effect = 'scrollx',
  infinite = true,
  speed = 500,
  arrows = false,
  defaultActiveIndex = 0,
  activeIndex: controlledIndex,
  beforeChange,
  afterChange,
  children,
  className = '',
  style,
}: CarouselProps) {
  const childArray = Children.toArray(children);
  const count = childArray.length;

  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<number | null>(null);

  const current = controlledIndex ?? internalIndex;

  const goTo = (next: number, wrap = true) => {
    let target = next;
    if (wrap && infinite) {
      target = ((next % count) + count) % count;
    } else {
      target = Math.min(Math.max(next, 0), count - 1);
    }
    if (target === current) return;
    beforeChange?.(current, target);
    setAnimating(true);
    if (controlledIndex === undefined) setInternalIndex(target);
    setTimeout(() => {
      setAnimating(false);
      afterChange?.(target);
    }, speed);
  };

  useEffect(() => {
    if (!autoplay || count <= 1) return undefined;
    timerRef.current = window.setInterval(() => goTo(current + 1), autoplaySpeed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, autoplaySpeed, current, count]);

  const showDots = dots !== false;
  const dotsCls = typeof dots === 'object' ? dots.className : undefined;

  const isFade = effect === 'fade';
  const isVertical = dotPosition === 'left' || dotPosition === 'right';

  return (
    <div
      className={[
        'orot-carousel',
        `orot-carousel--dots-${dotPosition}`,
        isVertical && 'orot-carousel--vertical-dots',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      <div className="orot-carousel__track-wrap">
        {arrows && count > 1 && (
          <button
            type="button"
            className="orot-carousel__arrow orot-carousel__arrow--prev"
            onClick={() => goTo(current - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        <div
          className="orot-carousel__track"
          style={isFade ? undefined : { transform: `translateX(-${current * 100}%)`, transition: animating ? `transform ${speed}ms ease` : undefined }}
        >
          {childArray.map((child, i) => (
            <div
              key={i}
              className={[
                'orot-carousel__slide',
                isFade && 'orot-carousel__slide--fade',
                isFade && i === current && 'orot-carousel__slide--active',
              ].filter(Boolean).join(' ')}
              style={isFade ? { transition: `opacity ${speed}ms ease` } : undefined}
              aria-hidden={i !== current}
            >
              {child}
            </div>
          ))}
        </div>

        {arrows && count > 1 && (
          <button
            type="button"
            className="orot-carousel__arrow orot-carousel__arrow--next"
            onClick={() => goTo(current + 1)}
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>

      {showDots && count > 1 && (
        <div className={['orot-carousel__dots', dotsCls].filter(Boolean).join(' ')}>
          {childArray.map((_, i) => (
            <button
              key={i}
              type="button"
              className={['orot-carousel__dot', i === current && 'orot-carousel__dot--active'].filter(Boolean).join(' ')}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
