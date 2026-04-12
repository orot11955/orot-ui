import type { CSSProperties, ReactNode } from 'react';

export type UploadStatus = 'uploading' | 'done' | 'error' | 'removed';
export type UploadListType = 'text' | 'picture' | 'picture-card' | 'picture-circle';

export interface UploadFile {
  uid: string;
  name: string;
  status?: UploadStatus;
  url?: string;
  thumbUrl?: string;
  percent?: number;
  size?: number;
  type?: string;
  originFileObj?: File;
  error?: unknown;
}

export interface UploadChangeInfo {
  file: UploadFile;
  fileList: UploadFile[];
}

export interface UploadProps {
  /** 허용 파일 타입 (accept 속성) */
  accept?: string;
  /** 드래그 앤 드롭 영역으로 렌더링 */
  drag?: boolean;
  multiple?: boolean;
  maxCount?: number;
  disabled?: boolean;
  fileList?: UploadFile[];
  defaultFileList?: UploadFile[];
  listType?: UploadListType;
  showUploadList?: boolean;
  /** 업로드 전 처리. false 반환 시 업로드 취소 */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean | File>;
  /** 직접 업로드 로직 주입 (action 대신 사용) */
  customRequest?: (options: {
    file: File;
    onSuccess: (result?: unknown) => void;
    onError: (err: Error) => void;
    onProgress: (percent: number) => void;
  }) => void;
  onChange?: (info: UploadChangeInfo) => void;
  onPreview?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
