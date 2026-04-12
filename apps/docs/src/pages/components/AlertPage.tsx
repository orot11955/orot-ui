import { Alert, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function AlertPage() {
  return (
    <DocPage title="Alert" description="페이지나 인라인 영역에서 중요한 정보를 강조해서 표시합니다.">
      <Example
        title="타입"
        code={`<Alert type="info" message="Info message" />
<Alert type="success" message="Success message" />
<Alert type="warning" message="Warning message" />
<Alert type="error" message="Error message" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Alert type="info" message="This is an informational message." />
          <Alert type="success" message="Operation completed successfully." />
          <Alert type="warning" message="Please review before proceeding." />
          <Alert type="error" message="Something went wrong. Please try again." />
        </div>
      </Example>

      <Example
        title="With Icon"
        code={`<Alert type="success" message="Success" showIcon />
<Alert type="error" message="Error" showIcon />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Alert type="info" message="Info with icon" showIcon />
          <Alert type="success" message="Success with icon" showIcon />
          <Alert type="warning" message="Warning with icon" showIcon />
          <Alert type="error" message="Error with icon" showIcon />
        </div>
      </Example>

      <Example
        title="With Description"
        code={`<Alert
  type="warning"
  message="Warning"
  description="This action cannot be undone. Please make sure you have backed up your data."
  showIcon
/>`}
      >
        <Alert
          type="warning"
          message="Warning"
          description="This action cannot be undone. Please make sure you have backed up your data."
          showIcon
        />
      </Example>

      <Example
        title="Closable + Action"
        code={`<Alert
  type="info"
  message="Closable alert"
  closable
  action={<Button size="sm" variant="outlined">Details</Button>}
/>`}
      >
        <Alert
          type="info"
          message="This alert can be closed."
          closable
          showIcon
          action={<Button size="sm" variant="outlined">Details</Button>}
        />
      </Example>

      <Example
        title="Banner"
        description="banner prop으로 테두리 없이 꽉 찬 배너 스타일을 적용합니다."
        code={`<Alert type="warning" message="Your trial expires in 3 days." banner />
<Alert type="error" message="Service disruption detected." banner showIcon />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Alert type="warning" message="Your trial expires in 3 days." banner />
          <Alert type="error" message="Service disruption detected." banner showIcon />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: '알림 타입' },
          { name: 'message', type: 'ReactNode', description: '알림 메시지 (필수)' },
          { name: 'description', type: 'ReactNode', description: '상세 설명' },
          { name: 'showIcon', type: 'boolean', default: 'false', description: '기본 아이콘 표시' },
          { name: 'icon', type: 'ReactNode', description: '커스텀 아이콘' },
          { name: 'closable', type: 'boolean', default: 'false', description: '닫기 버튼 표시' },
          { name: 'action', type: 'ReactNode', description: '오른쪽 액션 요소' },
          { name: 'banner', type: 'boolean', default: 'false', description: '배너 스타일 (상단 고정)' },
          { name: 'onClose', type: '() => void', description: '닫기 콜백' },
        ]}
      />
    </DocPage>
  );
}
