import type { CSSProperties } from 'react';

export interface MarkdownEditorProps {
  /** Controlled value (raw markdown string) */
  value?: string;
  /** Initial value for uncontrolled mode */
  defaultValue?: string;
  /** Called whenever the content changes */
  onChange?: (value: string) => void;
  /** Placeholder shown when editor is empty */
  placeholder?: string;
  /** Read-only mode — no editing allowed */
  readOnly?: boolean;
  /** Show formatting toolbar */
  showToolbar?: boolean;
  /** Show floating toolbar when text is selected */
  showFloatingToolbar?: boolean;
  /** Show word / char count in footer */
  showWordCount?: boolean;
  /** Minimum editor height (CSS value or number → px) */
  minHeight?: number | string;
  /** Maximum editor height (CSS value or number → px) */
  maxHeight?: number | string;
  /** Focus the editor on mount */
  autoFocus?: boolean;
  /** Called when an image file is dropped or selected via toolbar.
   *  Return the URL to embed. If omitted, images are embedded as data-URLs. */
  onImageUpload?: (file: File) => Promise<string>;
  /** Called when a hashtag is clicked */
  onHashtagClick?: (tag: string) => void;
  className?: string;
  style?: CSSProperties;
}

/** Internal cursor bookmark: which line + char offset within that line */
export interface CursorPos {
  lineIndex: number;
  charOffset: number;
}

/** Anchor/focus pair for (potentially) non-collapsed selection */
export interface SelectionRange {
  start: CursorPos;
  end: CursorPos;
  collapsed: boolean;
}
