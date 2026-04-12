import { Bell } from 'lucide-react';
import { Badge, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function BadgePage() {
  return (
    <DocPage title="Badge" description="숫자나 점으로 알림이나 상태를 나타냅니다.">
      <Example
        title="Count"
        code={`<Badge count={5}><Button variant="outlined">Button</Button></Badge>
<Badge count={100} overflowCount={99}><Button variant="outlined">99+</Button></Badge>
<Badge count={0} showZero><Button variant="outlined">Zero</Button></Badge>`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge count={5}>
            <Button variant="outlined">Button</Button>
          </Badge>
          <Badge count={100} overflowCount={99}>
            <Button variant="outlined">99+</Button>
          </Badge>
          <Badge count={0} showZero>
            <Button variant="outlined">Zero</Button>
          </Badge>
        </div>
      </Example>

      <Example
        title="Dot"
        code={`<Badge dot><Bell size={18} /></Badge>`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Badge dot>
            <Bell size={18} />
          </Badge>
          <Badge dot color="var(--orot-color-success)">
            <Bell size={18} />
          </Badge>
        </div>
      </Example>

      <Example
        title="Standalone"
        code={`<Badge count={5} />
<Badge dot />`}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Badge count={5} />
          <Badge count={128} />
          <Badge dot />
        </div>
      </Example>

      <Example
        title="Status"
        description="status prop으로 상태 점을 표시합니다."
        code={`<Badge status="success" text="Success" />
<Badge status="processing" text="Processing" />
<Badge status="error" text="Error" />
<Badge status="warning" text="Warning" />
<Badge status="default" text="Default" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Badge status="success" text="Success" />
          <Badge status="processing" text="Processing" />
          <Badge status="error" text="Error" />
          <Badge status="warning" text="Warning" />
          <Badge status="default" text="Default" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'count', type: 'number | ReactNode', description: '표시할 숫자 또는 노드' },
          { name: 'dot', type: 'boolean', default: 'false', description: '점 모드' },
          { name: 'overflowCount', type: 'number', default: '99', description: '최대 표시 숫자 (초과 시 N+)' },
          { name: 'showZero', type: 'boolean', default: 'false', description: '0 표시' },
          { name: 'status', type: 'BadgeStatus', description: '상태 점 타입 (standalone)' },
          { name: 'color', type: 'string', description: 'CSS 색상 커스터마이징' },
          { name: 'text', type: 'ReactNode', description: 'status 모드 옆 텍스트' },
        ]}
      />
    </DocPage>
  );
}
