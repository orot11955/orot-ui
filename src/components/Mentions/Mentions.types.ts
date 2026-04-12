import type { CSSProperties } from 'react';

export interface MentionOption {
  value: string;
  label?: string;
}

export type MentionsStatus = 'error' | 'warning' | '';

export interface MentionsProps {
  options?: MentionOption[];
  /** 트리거 문자, 기본 '@' */
  prefix?: string | string[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  allowClear?: boolean;
  status?: MentionsStatus;
  split?: string;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  onChange?: (value: string) => void;
  onSelect?: (option: MentionOption, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  className?: string;
  style?: CSSProperties;
}
