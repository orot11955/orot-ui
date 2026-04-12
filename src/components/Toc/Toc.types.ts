import type { CSSProperties, ReactNode } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

export interface TocProps {
  /** Markdown text to extract headings from (mutually exclusive with items) */
  markdown?: string;
  /** Pre-parsed heading items (mutually exclusive with markdown) */
  items?: TocItem[];
  /** Currently active heading id (controlled) */
  activeId?: string;
  /** Maximum heading depth to include (1-6, default: 3) */
  maxDepth?: number;
  /** Title shown above the list */
  title?: ReactNode;
  /** Show indent guides for nested headings */
  indent?: boolean;
  /** Called when a heading link is clicked */
  onClick?: (id: string) => void;
  /** Use smooth scrolling when navigating (default: true) */
  smooth?: boolean;
  /** Observe scroll position and auto-update activeId (default: false) */
  observe?: boolean;
  className?: string;
  style?: CSSProperties;
}
