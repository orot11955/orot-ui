import { useState } from 'react';
import { Upload, Button } from 'orot-ui';
import type { UploadFile, UploadChangeInfo } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

function makeFile(name: string, status: UploadFile['status'] = 'done'): UploadFile {
  return { uid: name, name, status };
}

export default function UploadPage() {
  const [fileList, setFileList] = useState<UploadFile[]>([
    makeFile('report.pdf'),
    makeFile('photo.png'),
  ]);

  const handleChange = ({ fileList: next }: UploadChangeInfo) => setFileList(next);

  return (
    <DocPage
      title="Upload"
      description="파일을 선택하거나 드래그 앤 드롭해 업로드합니다. customRequest로 직접 업로드 로직을 주입할 수 있습니다."
    >
      <Example
        title="기본 버튼"
        code={`
<Upload>
  <Button>파일 선택</Button>
</Upload>
        `}
      >
        <Upload>
          <Button variant="outlined">파일 선택</Button>
        </Upload>
      </Example>

      <Example
        title="드래그 앤 드롭"
        description="drag prop을 사용하면 영역 전체에서 파일을 드롭할 수 있습니다."
        code={`
<Upload drag multiple>
  <p>파일을 여기에 드래그하거나 클릭해 선택하세요</p>
</Upload>
        `}
      >
        <Upload drag multiple>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--orot-color-text-muted)' }}>
            파일을 여기에 드래그하거나 클릭해 선택하세요
          </p>
        </Upload>
      </Example>

      <Example
        title="파일 목록 (controlled)"
        description="fileList와 onChange로 파일 목록을 직접 관리합니다."
        code={`
const [fileList, setFileList] = useState<UploadFile[]>([
  { uid: 'report.pdf', name: 'report.pdf', status: 'done' },
  { uid: 'photo.png', name: 'photo.png', status: 'done' },
]);

<Upload fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
  <Button>파일 추가</Button>
</Upload>
        `}
      >
        <Upload fileList={fileList} onChange={handleChange}>
          <Button variant="outlined">파일 추가</Button>
        </Upload>
      </Example>

      <Example
        title="최대 파일 수"
        description="maxCount로 업로드 가능한 최대 파일 수를 제한합니다."
        code={`
<Upload maxCount={1}>
  <Button>파일 1개만 선택</Button>
</Upload>
        `}
      >
        <Upload maxCount={1}>
          <Button variant="outlined">파일 1개만 선택</Button>
        </Upload>
      </Example>

      <Example
        title="파일 타입 제한"
        description="accept prop으로 허용 파일 타입을 제한합니다."
        code={`
<Upload accept="image/*">
  <Button>이미지만 선택</Button>
</Upload>
        `}
      >
        <Upload accept="image/*">
          <Button variant="outlined">이미지만 선택</Button>
        </Upload>
      </Example>

      <Example
        title="Disabled"
        code={`
<Upload disabled>
  <Button disabled>비활성화</Button>
</Upload>
        `}
      >
        <Upload disabled>
          <Button variant="outlined" disabled>업로드 비활성화</Button>
        </Upload>
      </Example>

      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', description: '트리거 버튼 또는 드롭 영역 내용' },
          { name: 'drag', type: 'boolean', default: 'false', description: '드래그 앤 드롭 영역으로 렌더링' },
          { name: 'multiple', type: 'boolean', default: 'false', description: '다중 파일 선택 허용' },
          { name: 'accept', type: 'string', description: '허용 파일 타입 (HTML accept 속성)' },
          { name: 'maxCount', type: 'number', description: '최대 파일 수. 초과 시 목록 앞 파일 제거' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화' },
          { name: 'fileList', type: 'UploadFile[]', description: '파일 목록 (controlled)' },
          { name: 'defaultFileList', type: 'UploadFile[]', description: '초기 파일 목록' },
          { name: 'listType', type: "'text' | 'picture' | 'picture-card' | 'picture-circle'", default: "'text'", description: '파일 목록 표시 형식' },
          { name: 'showUploadList', type: 'boolean', default: 'true', description: '파일 목록 표시 여부' },
          { name: 'beforeUpload', type: '(file, fileList) => boolean | Promise', description: '업로드 전 처리. false 반환 시 업로드 취소' },
          { name: 'customRequest', type: '(options) => void', description: '직접 업로드 로직 주입' },
          { name: 'onChange', type: '(info: UploadChangeInfo) => void', description: '파일 목록 변경 콜백' },
          { name: 'onPreview', type: '(file: UploadFile) => void', description: '미리보기 클릭 콜백' },
          { name: 'onRemove', type: '(file: UploadFile) => boolean | void | Promise', description: '삭제 버튼 클릭 콜백. false 반환 시 삭제 취소' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
