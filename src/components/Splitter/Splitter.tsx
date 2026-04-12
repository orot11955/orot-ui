import React, {
  useEffect,
  useRef,
  useState,
  isValidElement,
  Children,
  type CSSProperties,
} from 'react';
import './Splitter.css';
import type { SplitterPanelProps, SplitterProps } from './Splitter.types';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPanelBounds(panel: React.ReactElement<SplitterPanelProps>) {
  const min = clamp(panel.props.min ?? 0, 0, 100);
  const max = clamp(panel.props.max ?? 100, min, 100);
  return { min, max };
}

function rebalanceSizes(
  initialSizes: number[],
  bounds: Array<{ min: number; max: number }>,
) {
  const sizes = initialSizes.map((size, index) =>
    clamp(size, bounds[index].min, bounds[index].max),
  );

  for (let iteration = 0; iteration < 12; iteration += 1) {
    const currentTotal = sizes.reduce((sum, size) => sum + size, 0);
    const diff = 100 - currentTotal;

    if (Math.abs(diff) < 0.01) break;

    const adjustable = sizes
      .map((size, index) => ({
        index,
        capacity:
          diff > 0
            ? bounds[index].max - size
            : size - bounds[index].min,
      }))
      .filter((entry) => entry.capacity > 0.01);

    if (!adjustable.length) break;

    const totalCapacity = adjustable.reduce(
      (sum, entry) => sum + entry.capacity,
      0,
    );

    adjustable.forEach((entry) => {
      const delta = diff * (entry.capacity / totalCapacity);
      sizes[entry.index] = clamp(
        sizes[entry.index] + delta,
        bounds[entry.index].min,
        bounds[entry.index].max,
      );
    });
  }

  return sizes.map((size) => Number(size.toFixed(4)));
}

function resolvePanelSizes(
  panels: React.ReactElement<SplitterPanelProps>[],
  previousSizes?: number[],
) {
  if (panels.length === 0) return [];

  const bounds = panels.map(getPanelBounds);
  const preferredSizes = panels.map(
    (panel, index) =>
      panel.props.size ?? panel.props.defaultSize ?? previousSizes?.[index],
  );
  const explicitTotal = preferredSizes.reduce<number>(
    (sum, size) => sum + (size ?? 0),
    0,
  );
  const missingCount = preferredSizes.filter((size) => size === undefined).length;
  const fallbackSize =
    missingCount > 0
      ? Math.max(100 - explicitTotal, 0) / missingCount
      : 100 / panels.length;

  return rebalanceSizes(
    preferredSizes.map((size) => size ?? fallbackSize),
    bounds,
  );
}

/* ── Panel (data container only — rendered by SplitterRoot) ── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Panel(_props: SplitterPanelProps) {
  return null;
}

function SplitterRoot({
  orientation = 'horizontal',
  onResize,
  onResizeStart,
  onResizeEnd,
  className = '',
  style,
  children,
  ...rest
}: SplitterProps) {
  const panels = Children.toArray(children).filter(
    isValidElement,
  ) as React.ReactElement<SplitterPanelProps>[];
  const panelCount = panels.length;

  const [sizes, setSizes] = useState<number[]>(() =>
    resolvePanelSizes(panels),
  );
  const [activeDivider, setActiveDivider] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Always-current refs — avoid stale closures in event handlers
  const sizesRef = useRef(sizes);
  sizesRef.current = sizes;

  const panelsRef = useRef(panels);
  panelsRef.current = panels;

  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;

  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const onResizeEndRef = useRef(onResizeEnd);
  onResizeEndRef.current = onResizeEnd;

  // Drag state — no need to be reactive
  const dragRef = useRef<{
    index: number;
    startPos: number;
    startSizes: number[];
  } | null>(null);

  const panelSignature = panels
    .map((panel) =>
      [
        panel.props.size,
        panel.props.defaultSize,
        panel.props.min,
        panel.props.max,
        panel.props.resizable === false ? 'fixed' : 'resize',
      ].join(':'),
    )
    .join('|');

  useEffect(() => {
    setSizes((previousSizes) => resolvePanelSizes(panels, previousSizes));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelCount, panelSignature]);

  // Register global mouse listeners once — use refs for current values
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;

      const { index, startPos, startSizes } = dragRef.current;
      const isHorizontal = orientationRef.current === 'horizontal';
      const currentPos = isHorizontal ? event.clientX : event.clientY;
      const containerSize = isHorizontal
        ? containerRef.current.offsetWidth
        : containerRef.current.offsetHeight;
      if (containerSize <= 0) return;

      const deltaPercent = ((currentPos - startPos) / containerSize) * 100;
      const previousPanel = panelsRef.current[index];
      const nextPanel = panelsRef.current[index + 1];
      if (!previousPanel || !nextPanel) return;

      const previousBounds = getPanelBounds(previousPanel);
      const nextBounds = getPanelBounds(nextPanel);
      const minDelta = Math.max(
        previousBounds.min - startSizes[index],
        startSizes[index + 1] - nextBounds.max,
      );
      const maxDelta = Math.min(
        previousBounds.max - startSizes[index],
        startSizes[index + 1] - nextBounds.min,
      );
      const clampedDelta = clamp(deltaPercent, minDelta, maxDelta);

      const nextSizes = [...startSizes];
      nextSizes[index] = Number((startSizes[index] + clampedDelta).toFixed(4));
      nextSizes[index + 1] = Number(
        (startSizes[index + 1] - clampedDelta).toFixed(4),
      );

      setSizes(nextSizes);
      sizesRef.current = nextSizes;
      onResizeRef.current?.(nextSizes);
    };

    const handleMouseUp = () => {
      if (dragRef.current) {
        onResizeEndRef.current?.(sizesRef.current);
      }
      dragRef.current = null;
      setActiveDivider(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); // mount/unmount only — current values via refs

  const handleDividerMouseDown = (index: number, event: React.MouseEvent) => {
    const previousPanel = panels[index];
    const nextPanel = panels[index + 1];
    if (
      previousPanel?.props.resizable === false ||
      nextPanel?.props.resizable === false
    )
      return;

    event.preventDefault();
    dragRef.current = {
      index,
      startPos:
        orientation === 'horizontal' ? event.clientX : event.clientY,
      startSizes: [...sizesRef.current],
    };
    setActiveDivider(index);
    onResizeStart?.(sizesRef.current);
    document.body.style.cursor =
      orientation === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const cls = [
    'orot-splitter',
    `orot-splitter--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className={cls} style={style} {...rest}>
      {panels.map((panel, index) => {
        const panelStyle: CSSProperties =
          orientation === 'horizontal'
            ? {
                width: `${sizes[index]}%`,
                flex: `0 0 ${sizes[index]}%`,
                ...panel.props.style,
              }
            : {
                height: `${sizes[index]}%`,
                flex: `0 0 ${sizes[index]}%`,
                ...panel.props.style,
              };

        return (
          <React.Fragment key={index}>
            <div
              className={`orot-splitter__panel${
                panel.props.className ? ` ${panel.props.className}` : ''
              }`}
              style={panelStyle}
            >
              {panel.props.children}
            </div>
            {index < panelCount - 1 && (
              <div
                className={`orot-splitter__divider${
                  activeDivider === index
                    ? ' orot-splitter__divider--active'
                    : ''
                }`}
                onMouseDown={(event) => handleDividerMouseDown(index, event)}
                role="separator"
                aria-orientation={orientation}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export const Splitter = Object.assign(SplitterRoot, { Panel });
