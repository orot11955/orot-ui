import { message, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function MessagePage() {
  return (
    <DocPage title="Message" description="화면 상단 중앙에 표시되는 전역 메시지입니다.">
      <Example
        title="기본 타입"
        code={`message.success('Operation successful!');
message.info('Some information.');
message.warning('This is a warning.');
message.error('Something went wrong!');`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => message.success('Operation completed successfully!')}>
            Success
          </Button>
          <Button variant="outlined" onClick={() => message.info('Some information to display.')}>
            Info
          </Button>
          <Button variant="outlined" onClick={() => message.warning('This is a warning message.')}>
            Warning
          </Button>
          <Button variant="outlined" onClick={() => message.error('Something went wrong!')}>
            Error
          </Button>
          <Button variant="outlined" onClick={() => message.loading('Loading...')}>
            Loading
          </Button>
        </div>
      </Example>

      <Example
        title="Duration"
        code={`message.info('Quick message', 1);
message.info({ content: 'Permanent', duration: 0 });`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outlined" onClick={() => message.info('Disappears in 1 second.', 1)}>
            1s Duration
          </Button>
          <Button variant="outlined" onClick={() => message.info({ content: 'Click close to dismiss.', duration: 0 })}>
            No Auto Close
          </Button>
        </div>
      </Example>

      <Example
        title="Custom Content"
        code={`message.open({ content: <span>Custom <b>content</b></span>, duration: 3 });`}
      >
        <Button
          variant="outlined"
          onClick={() => message.open({ content: <span>Custom <strong>bold</strong> content</span>, duration: 3 })}
        >
          Custom Content
        </Button>
      </Example>

      <PropsTable
        rows={[
          { name: 'content', type: 'ReactNode', description: '메시지 내용 (필수)' },
          { name: 'type', type: "'success' | 'info' | 'warning' | 'error' | 'loading'", description: '메시지 타입' },
          { name: 'duration', type: 'number', default: '3', description: '자동 닫힘 시간 (초, 0이면 수동)' },
          { name: 'icon', type: 'ReactNode', description: '커스텀 아이콘' },
          { name: 'key', type: 'string', description: '메시지 고유 키' },
          { name: 'onClick', type: '() => void', description: '클릭 콜백' },
          { name: 'onClose', type: '() => void', description: '닫기 콜백' },
        ]}
      />
    </DocPage>
  );
}
