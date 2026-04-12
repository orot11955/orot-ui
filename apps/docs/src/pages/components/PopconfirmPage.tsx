import { useState } from 'react';
import { Popconfirm, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function PopconfirmPage() {
  const [confirmed, setConfirmed] = useState<string | null>(null);

  return (
    <DocPage title="Popconfirm" description="위험한 작업 전에 팝오버로 확인을 요청합니다.">
      <Example
        title="기본"
        code={`<Popconfirm
  title="Are you sure?"
  onConfirm={() => console.log('confirmed')}
  onCancel={() => console.log('cancelled')}
>
  <Button variant="outlined">Delete</Button>
</Popconfirm>`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Popconfirm
            title="Are you sure you want to delete?"
            description="This action cannot be undone."
            onConfirm={() => setConfirmed('Deleted!')}
            onCancel={() => setConfirmed('Cancelled')}
          >
            <Button variant="outlined">Delete item</Button>
          </Popconfirm>
          {confirmed && (
            <span style={{ fontSize: 13, color: 'var(--orot-color-text-secondary)' }}>
              → {confirmed}
            </span>
          )}
        </div>
      </Example>

      <Example
        title="Custom OK / Cancel text"
        code={`<Popconfirm
  title="Confirm logout?"
  okText="Yes, logout"
  cancelText="Stay"
>
  <Button>Logout</Button>
</Popconfirm>`}
      >
        <Popconfirm
          title="Confirm logout?"
          okText="Yes, logout"
          cancelText="Stay"
        >
          <Button>Logout</Button>
        </Popconfirm>
      </Example>

      <Example
        title="Placement"
        code={`<Popconfirm title="Confirm?" placement="bottom"><Button>bottom</Button></Popconfirm>
<Popconfirm title="Confirm?" placement="topRight"><Button>topRight</Button></Popconfirm>`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Popconfirm title="Confirm?" placement="bottom">
            <Button variant="outlined">bottom</Button>
          </Popconfirm>
          <Popconfirm title="Confirm?" placement="topRight">
            <Button variant="outlined">topRight</Button>
          </Popconfirm>
        </div>
      </Example>

      <Example
        title="okType + showCancel"
        code={`<Popconfirm title="Archive item?" okType="outlined" showCancel={false}>
  <Button variant="outlined">Archive</Button>
</Popconfirm>`}
      >
        <Popconfirm title="Archive item?" okType="outlined" showCancel={false}>
          <Button variant="outlined">Archive</Button>
        </Popconfirm>
      </Example>

      <PropsTable
        rows={[
          { name: 'title', type: 'ReactNode', description: '확인 제목 (필수)' },
          { name: 'description', type: 'ReactNode', description: '상세 설명' },
          { name: 'onConfirm', type: '() => void', description: 'OK 클릭 콜백' },
          { name: 'onCancel', type: '() => void', description: 'Cancel 클릭 콜백' },
          { name: 'okText', type: 'ReactNode', default: "'OK'", description: 'OK 버튼 텍스트' },
          { name: 'cancelText', type: 'ReactNode', default: "'Cancel'", description: '취소 버튼 텍스트' },
          { name: 'okType', type: "'solid' | 'outlined' | 'text' | 'link'", default: "'solid'", description: '확인 버튼 스타일' },
          { name: 'showCancel', type: 'boolean', default: 'true', description: '취소 버튼 표시 여부' },
          { name: 'placement', type: 'TooltipPlacement', default: "'top'", description: '팝오버 위치' },
          { name: 'disabled', type: 'boolean', description: '비활성화 (팝오버 표시 안 함)' },
          { name: 'icon', type: 'ReactNode', default: "'⚠'", description: '경고 아이콘' },
        ]}
      />
    </DocPage>
  );
}
