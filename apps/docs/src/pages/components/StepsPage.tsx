import { useState } from 'react';
import { Steps, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const items = [
  { title: 'Login', description: 'Authenticate your account.' },
  { title: 'Verification', description: 'Verify your identity.' },
  { title: 'Payment', description: 'Enter payment details.' },
  { title: 'Done' },
];

export default function StepsPage() {
  const [current, setCurrent] = useState(1);
  const fullWidthStyle = { width: '100%' } as const;

  return (
    <DocPage title="Steps" description="프로세스 단계를 시각적으로 나타냅니다.">
      <Example
        title="기본"
        code={`<Steps items={items} current={1} />`}
      >
        <div style={fullWidthStyle}>
          <Steps items={items} current={current} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Button size="sm" variant="outlined" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
            Previous
          </Button>
          <Button size="sm" onClick={() => setCurrent(Math.min(items.length - 1, current + 1))} disabled={current === items.length - 1}>
            Next
          </Button>
        </div>
      </Example>

      <Example
        title="Vertical"
        code={`<Steps items={items} current={1} direction="vertical" />`}
      >
        <div style={fullWidthStyle}>
          <Steps items={items} current={1} direction="vertical" />
        </div>
      </Example>

      <Example
        title="Progress Dot"
        code={`<Steps items={items} current={1} progressDot />`}
      >
        <div style={fullWidthStyle}>
          <Steps items={items} current={1} progressDot />
        </div>
      </Example>

      <Example
        title="Small size"
        code={`<Steps items={items} current={1} size="sm" />`}
      >
        <div style={fullWidthStyle}>
          <Steps items={items} current={1} size="sm" />
        </div>
      </Example>

      <Example
        title="Clickable (onChange)"
        description="onChange를 설정하면 각 스텝을 클릭해서 이동할 수 있습니다."
        code={`const [current, setCurrent] = useState(0);
<Steps items={items} current={current} onChange={setCurrent} />`}
      >
        <div style={fullWidthStyle}>
          <Steps items={items} current={current} onChange={setCurrent} />
        </div>
      </Example>

      <Example
        title="Status override"
        code={`<Steps items={[
  { title: 'Done', status: 'finish' },
  { title: 'Error', status: 'error' },
  { title: 'Next', status: 'wait' },
]} current={1} />`}
      >
        <div style={fullWidthStyle}>
          <Steps
            items={[
              { title: 'Done', status: 'finish', description: 'Completed.' },
              { title: 'Error', status: 'error', description: 'Failed.' },
              { title: 'Next', status: 'wait' },
            ]}
            current={1}
          />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'StepItem[]', description: '단계 목록. title 필수' },
          { name: 'current', type: 'number', default: '0', description: '현재 단계 인덱스 (0부터)' },
          { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '진행 방향' },
          { name: 'progressDot', type: 'boolean', default: 'false', description: '점 스타일' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '크기' },
          { name: 'onChange', type: '(current: number) => void', description: '클릭 시 단계 변경 콜백 (clickable)' },
        ]}
      />
    </DocPage>
  );
}
