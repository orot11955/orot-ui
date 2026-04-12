import type { CSSProperties, ReactNode } from 'react';

export interface AnchorItem {
  key: string;
  href: string;
  title: ReactNode;
  children?: AnchorItem[];
}

export interface AnchorProps {
  items: AnchorItem[];
  /** 컨테이너에 affix(sticky) 적용 여부 */
  affix?: boolean;
  /** affix 시 상단 오프셋 */
  offsetTop?: number;
  /** 활성 앵커 판정 범위 (px) */
  bounds?: number;
  /** 스크롤 목표 보정값 (px) */
  targetOffset?: number;
  onChange?: (currentKey: string) => void;
  getCurrentAnchor?: () => string;
  className?: string;
  style?: CSSProperties;
}
