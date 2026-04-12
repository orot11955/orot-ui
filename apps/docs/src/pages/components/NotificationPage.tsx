import { notification, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function NotificationPage() {
  return (
    <DocPage title="Notification" description="화면 모서리에 표시되는 전역 알림 메시지입니다.">
      <Example
        title="기본 타입"
        code={`notification.success({ message: 'Success!', description: 'Operation completed.' });
notification.info({ message: 'Info', description: 'Something to note.' });
notification.warning({ message: 'Warning', description: 'Be careful.' });
notification.error({ message: 'Error', description: 'Something went wrong.' });`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => notification.success({ message: 'Success!', description: 'Operation completed successfully.' })}>
            Success
          </Button>
          <Button variant="outlined" onClick={() => notification.info({ message: 'Info', description: 'Something to note.' })}>
            Info
          </Button>
          <Button variant="outlined" onClick={() => notification.warning({ message: 'Warning', description: 'Be careful with this action.' })}>
            Warning
          </Button>
          <Button variant="outlined" onClick={() => notification.error({ message: 'Error', description: 'Something went wrong.' })}>
            Error
          </Button>
        </div>
      </Example>

      <Example
        title="Placement"
        code={`notification.info({ message: 'Top Left', placement: 'topLeft' });
notification.info({ message: 'Bottom Right', placement: 'bottomRight' });`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'top', 'bottom'] as const).map(p => (
            <Button
              key={p}
              variant="outlined"
              size="sm"
              onClick={() => notification.info({ message: p, placement: p })}
            >
              {p}
            </Button>
          ))}
        </div>
      </Example>

      <Example
        title="Duration"
        code={`notification.info({ message: 'Long', description: '10초 후 닫힘', duration: 10 });
notification.info({ message: 'Permanent', description: '수동으로만 닫힘', duration: 0 });`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outlined" onClick={() => notification.info({ message: 'Long Duration', description: '10초 후 자동으로 닫힙니다.', duration: 10 })}>
            10s Duration
          </Button>
          <Button variant="outlined" onClick={() => notification.info({ message: 'Permanent', description: '닫기 버튼을 클릭하세요.', duration: 0 })}>
            No Auto Close
          </Button>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'message', type: 'ReactNode', description: '알림 제목 (필수)' },
          { name: 'description', type: 'ReactNode', description: '알림 내용' },
          { name: 'type', type: "'success' | 'info' | 'warning' | 'error'", description: '알림 타입' },
          { name: 'placement', type: "'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom'", default: "'topRight'", description: '표시 위치' },
          { name: 'duration', type: 'number', default: '4.5', description: '자동 닫힘 시간 (초, 0이면 수동)' },
          { name: 'icon', type: 'ReactNode', description: '커스텀 아이콘' },
          { name: 'key', type: 'string', description: '알림 고유 키' },
          { name: 'closable', type: 'boolean', default: 'true', description: '닫기 버튼 표시' },
          { name: 'onClick', type: '() => void', description: '클릭 콜백' },
          { name: 'onClose', type: '() => void', description: '닫기 콜백' },
        ]}
      />
    </DocPage>
  );
}
