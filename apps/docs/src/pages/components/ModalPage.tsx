import { useState } from 'react';
import { Input, Modal, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

function DraftField() {
  return <Input defaultValue="Draft text" placeholder="Type and reopen modal" />;
}

export default function ModalPage() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);

  return (
    <DocPage title="Modal" description="오버레이로 추가 컨텐츠나 작업을 표시합니다.">
      <Example
        title="기본"
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Modal</Button>
<Modal
  open={open}
  title="Modal Title"
  onOk={() => setOpen(false)}
  onCancel={() => setOpen(false)}
>
  <p>Modal content goes here.</p>
</Modal>`}
      >
        <Button onClick={() => setOpen1(true)}>Open Modal</Button>
        <Modal
          open={open1}
          title="Modal Title"
          onOk={() => setOpen1(false)}
          onCancel={() => setOpen1(false)}
        >
          <p>Modal content goes here. You can put any content inside a modal dialog.</p>
        </Modal>
      </Example>

      <Example
        title="Centered"
        code={`<Modal open={open} centered title="Centered" onOk={...} onCancel={...}>...</Modal>`}
      >
        <Button onClick={() => setOpen2(true)}>Centered Modal</Button>
        <Modal
          open={open2}
          title="Centered Modal"
          centered
          onOk={() => setOpen2(false)}
          onCancel={() => setOpen2(false)}
        >
          <p>This modal is centered on the screen.</p>
        </Modal>
      </Example>

      <Example
        title="Custom Footer"
        code={`<Modal
  open={open}
  title="Custom Footer"
  footer={<Button onClick={() => setOpen(false)}>Close</Button>}
  onCancel={() => setOpen(false)}
>
  ...
</Modal>`}
      >
        <Button onClick={() => setOpen3(true)}>Custom Footer</Button>
        <Modal
          open={open3}
          title="Custom Footer"
          footer={<Button onClick={() => setOpen3(false)}>Close</Button>}
          onCancel={() => setOpen3(false)}
        >
          <p>This modal has a custom footer.</p>
        </Modal>
      </Example>

      <Example
        title="Destroy On Hidden"
        description="destroyOnHidden을 켜면 닫을 때 내부 컨텐츠가 언마운트되어 다시 열 때 초기 상태로 돌아갑니다."
        code={`<Modal
  open={open}
  title="Destroy On Hidden"
  destroyOnHidden
  onCancel={() => setOpen(false)}
  onOk={() => setOpen(false)}
>
  <Input defaultValue="Draft text" />
</Modal>`}
      >
        <Button onClick={() => setOpen4(true)}>Destroy On Hidden</Button>
        <Modal
          open={open4}
          title="Destroy On Hidden"
          destroyOnHidden
          onOk={() => setOpen4(false)}
          onCancel={() => setOpen4(false)}
        >
          <DraftField />
        </Modal>
      </Example>

      <Example
        title="Inline Container"
        description="getContainer=false를 사용하면 현재 레이아웃 안에서 모달을 렌더할 수 있습니다."
        code={`<Modal
  open={open}
  title="Inline Container"
  getContainer={false}
  zIndex={1100}
  onCancel={() => setOpen(false)}
  onOk={() => setOpen(false)}
>
  <p>Rendered inline.</p>
</Modal>`}
      >
        <div style={{ position: 'relative', border: '1px solid var(--orot-color-border)', padding: 16, borderRadius: 4 }}>
          <Button onClick={() => setOpen5(true)}>Inline Container</Button>
          <Modal
            open={open5}
            title="Inline Container"
            getContainer={false}
            zIndex={1100}
            onOk={() => setOpen5(false)}
            onCancel={() => setOpen5(false)}
          >
            <p>Rendered inline.</p>
          </Modal>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'open', type: 'boolean', description: '표시 여부 (필수)' },
          { name: 'title', type: 'ReactNode', description: '모달 제목' },
          { name: 'footer', type: 'ReactNode | null', description: '하단 버튼 영역. null이면 숨김, 미지정 시 OK/Cancel' },
          { name: 'width', type: 'string | number', default: '520', description: '모달 너비' },
          { name: 'zIndex', type: 'number', description: '오버레이 z-index' },
          { name: 'closable', type: 'boolean', default: 'true', description: '우상단 X 버튼 표시' },
          { name: 'maskClosable', type: 'boolean', default: 'true', description: '배경 클릭으로 닫기' },
          { name: 'centered', type: 'boolean', default: 'false', description: '수직 중앙 정렬' },
          { name: 'closeIcon', type: 'ReactNode', description: '닫기 아이콘 커스터마이즈' },
          { name: 'getContainer', type: 'HTMLElement | (() => HTMLElement) | false', description: '포털 대상. false면 현재 위치에 렌더' },
          { name: 'onOk', type: '() => void', description: 'OK 버튼 클릭 콜백' },
          { name: 'onCancel', type: '() => void', description: '취소/닫기 콜백' },
          { name: 'okText', type: 'ReactNode', default: "'OK'", description: 'OK 버튼 텍스트' },
          { name: 'cancelText', type: 'ReactNode', default: "'Cancel'", description: '취소 버튼 텍스트' },
          { name: 'confirmLoading', type: 'boolean', default: 'false', description: 'OK 버튼 로딩 상태' },
          { name: 'keyboard', type: 'boolean', default: 'true', description: 'ESC 키로 닫기 허용' },
          { name: 'mask', type: 'boolean', default: 'true', description: '배경 마스크 표시 여부' },
          { name: 'afterOpenChange', type: '(open: boolean) => void', description: '열림 상태 변경 후 콜백' },
          { name: 'afterClose', type: '() => void', description: '닫힘 이후 콜백' },
          { name: 'destroyOnHidden', type: 'boolean', default: 'false', description: '닫힐 때 내부 컨텐츠를 언마운트' },
        ]}
      />
    </DocPage>
  );
}
