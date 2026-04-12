import type { CSSProperties, ReactNode } from 'react';

export interface ImagePreviewConfig {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 미리보기 마스크 텍스트/아이콘 */
  mask?: ReactNode;
  /** 미리보기 이미지 src (원본과 다를 때) */
  src?: string;
}

export interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  /** 로드 실패 시 대체 src */
  fallback?: string;
  /** 로딩 중 플레이스홀더 */
  placeholder?: ReactNode | boolean;
  /** 미리보기 설정. false 이면 비활성화 */
  preview?: boolean | ImagePreviewConfig;
  className?: string;
  style?: CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

export interface ImageGroupProps {
  children: ReactNode;
  /** 그룹 단위로 미리보기 공유 */
  preview?: boolean;
}
