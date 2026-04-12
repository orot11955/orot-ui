import { useRef, useState } from 'react';
import './Upload.css';
import type { UploadChangeInfo, UploadFile, UploadProps } from './Upload.types';

let uidCounter = 0;
const genUid = () => `orot-upload-${Date.now()}-${uidCounter++}`;

function fileToUploadFile(f: File): UploadFile {
  return {
    uid: genUid(),
    name: f.name,
    size: f.size,
    type: f.type,
    status: 'uploading',
    percent: 0,
    originFileObj: f,
  };
}

function FileIcon() {
  return (
    <svg className="orot-upload__file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="orot-upload__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

export function Upload({
  accept,
  drag = false,
  multiple = false,
  maxCount,
  disabled = false,
  fileList: controlledList,
  defaultFileList = [],
  listType = 'text',
  showUploadList = true,
  beforeUpload,
  customRequest,
  onChange,
  onPreview,
  onRemove,
  children,
  className = '',
  style,
}: UploadProps) {
  const [internalList, setInternalList] = useState<UploadFile[]>(defaultFileList);
  const fileList = controlledList ?? internalList;

  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateList = (next: UploadFile[]) => {
    if (!controlledList) setInternalList(next);
  };

  const processFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const allowed = maxCount != null ? arr.slice(0, maxCount - fileList.length) : arr;

    for (const f of allowed) {
      if (beforeUpload) {
        const result = await beforeUpload(f, arr);
        if (result === false) continue;
      }

      const uf = fileToUploadFile(f);
      const next = [...fileList, uf];
      updateList(next);
      onChange?.({ file: uf, fileList: next });

      if (customRequest) {
        customRequest({
          file: f,
          onSuccess: () => {
            const done = fileList.map((x) => x.uid === uf.uid ? { ...x, status: 'done' as const, percent: 100 } : x);
            updateList(done);
            onChange?.({ file: { ...uf, status: 'done' }, fileList: done });
          },
          onError: (err) => {
            const errList = fileList.map((x) => x.uid === uf.uid ? { ...x, status: 'error' as const, error: err } : x);
            updateList(errList);
            onChange?.({ file: { ...uf, status: 'error' }, fileList: errList });
          },
          onProgress: (percent) => {
            const progList = fileList.map((x) => x.uid === uf.uid ? { ...x, percent } : x);
            updateList(progList);
          },
        });
      } else {
        // customRequest 없으면 즉시 done
        setTimeout(() => {
          const done = [...fileList, { ...uf, status: 'done' as const, percent: 100 }];
          updateList(done);
          onChange?.({ file: { ...uf, status: 'done' }, fileList: done });
        }, 0);
      }
    }
  };

  const handleRemove = async (file: UploadFile) => {
    if (onRemove) {
      const result = await onRemove(file);
      if (result === false) return;
    }
    const next = fileList.filter((f) => f.uid !== file.uid);
    updateList(next);
    const removed = { ...file, status: 'removed' as const };
    onChange?.({ file: removed, fileList: next } as UploadChangeInfo);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const triggerInput = () => {
    if (!disabled) inputRef.current?.click();
  };

  const isPictureMode = listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle';

  const cls = [
    'orot-upload',
    drag && 'orot-upload--drag',
    drag && dragging && 'orot-upload--dragging',
    disabled && 'orot-upload--disabled',
    `orot-upload--${listType}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} style={style}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="orot-upload__input"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {drag ? (
        <div
          className="orot-upload__dragger"
          onClick={triggerInput}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => e.key === 'Enter' && triggerInput()}
          aria-disabled={disabled}
        >
          {children ?? (
            <>
              <UploadIcon />
              <p className="orot-upload__drag-text">클릭 또는 파일을 여기에 드래그하세요</p>
              <p className="orot-upload__drag-hint">
                {accept ? `허용 형식: ${accept}` : '모든 형식 지원'}
                {maxCount ? ` · 최대 ${maxCount}개` : ''}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="orot-upload__trigger" onClick={triggerInput}>
          {children ?? (
            <button type="button" className="orot-upload__btn" disabled={disabled}>
              <UploadIcon />
              <span>파일 선택</span>
            </button>
          )}
        </div>
      )}

      {showUploadList && fileList.length > 0 && (
        <ul className={`orot-upload__list orot-upload__list--${listType}`}>
          {fileList.map((file) => (
            <li
              key={file.uid}
              className={['orot-upload__item', `orot-upload__item--${file.status ?? 'done'}`].join(' ')}
            >
              {isPictureMode && (
                <span className="orot-upload__thumb">
                  {file.thumbUrl || file.url ? (
                    <img src={file.thumbUrl ?? file.url} alt={file.name} />
                  ) : (
                    <FileIcon />
                  )}
                </span>
              )}
              {!isPictureMode && <FileIcon />}
              <span
                className="orot-upload__name"
                onClick={() => onPreview?.(file)}
                title={file.name}
              >
                {file.name}
              </span>
              {file.status === 'uploading' && (
                <span className="orot-upload__progress">
                  <span
                    className="orot-upload__progress-bar"
                    style={{ width: `${file.percent ?? 0}%` }}
                  />
                </span>
              )}
              <button
                type="button"
                className="orot-upload__remove"
                onClick={() => handleRemove(file)}
                aria-label={`remove ${file.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
