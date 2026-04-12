import type { ReactNode } from 'react';

export type CalendarMode = 'month' | 'year';

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  mode?: CalendarMode;
  fullscreen?: boolean;
  validRange?: [Date, Date];
  disabledDate?: (date: Date) => boolean;
  dateCellRender?: (date: Date) => ReactNode;
  monthCellRender?: (date: Date) => ReactNode;
  onSelect?: (date: Date, info: { source: 'date' | 'month' | 'year' | 'customize' }) => void;
  onChange?: (date: Date) => void;
  onPanelChange?: (date: Date, mode: CalendarMode) => void;
  className?: string;
  style?: React.CSSProperties;
}
