import { Popover, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function PopoverPage() {
  return (
    <DocPage title="Popover" description="클릭/호버 시 제목과 내용을 포함한 팝오버를 표시합니다.">
      <Example
        title="기본"
        code={`<Popover title="Title" content="Popover content here.">
  <Button variant="outlined">Hover me</Button>
</Popover>`}
      >
        <Popover title="Title" content="Popover content here.">
          <Button variant="outlined">Hover me</Button>
        </Popover>
      </Example>

      <Example
        title="Trigger"
        code={`<Popover title="Click" content="Clicked!" trigger="click">
  <Button variant="outlined">Click me</Button>
</Popover>`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Popover title="Hover" content="Triggered by hover." trigger="hover">
            <Button variant="outlined">Hover</Button>
          </Popover>
          <Popover title="Click" content="Triggered by click." trigger="click">
            <Button variant="outlined">Click</Button>
          </Popover>
        </div>
      </Example>

      <Example
        title="Placement"
        code={`<Popover title="Top" content="Top popover" placement="top">
  <Button>top</Button>
</Popover>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right'] as const).map(p => (
            <Popover key={p} title={p} content={`Placement: ${p}`} placement={p}>
              <Button variant="outlined" size="sm">{p}</Button>
            </Popover>
          ))}
        </div>
      </Example>

      <Example
        title="Rich Content"
        code={`<Popover
  title="Profile"
  content={<div><p>Name: John Doe</p><p>Role: Developer</p></div>}
  trigger="click"
>
  <Button>View Profile</Button>
</Popover>`}
      >
        <Popover
          title="Profile"
          content={
            <div>
              <p style={{ margin: '0 0 4px' }}>Name: John Doe</p>
              <p style={{ margin: 0 }}>Role: Developer</p>
            </div>
          }
          trigger="click"
        >
          <Button>View Profile</Button>
        </Popover>
      </Example>

      <PropsTable
        rows={[
          { name: 'title', type: 'ReactNode', description: '팝오버 제목' },
          { name: 'content', type: 'ReactNode', description: '팝오버 내용' },
          { name: 'placement', type: 'PopoverPlacement', default: "'top'", description: '표시 위치 (12가지)' },
          { name: 'trigger', type: "'hover' | 'click' | 'focus'", default: "'hover'", description: '트리거 방식' },
          { name: 'open', type: 'boolean', description: '표시 여부 (controlled)' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: '초기 표시 여부' },
          { name: 'arrow', type: 'boolean', default: 'true', description: '화살표 표시 여부' },
          { name: 'mouseEnterDelay', type: 'number', default: '0', description: '마우스 진입 후 지연 (초)' },
          { name: 'mouseLeaveDelay', type: 'number', default: '0.1', description: '마우스 이탈 후 지연 (초)' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
