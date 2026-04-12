import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Tag } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function TagPage() {
  return (
    <DocPage title="Tag" description="카테고리 분류, 상태 표시 등에 사용하는 태그입니다.">
      <Example
        title="기본"
        code={`<Tag>Default</Tag>
<Tag color="success">Success</Tag>
<Tag color="warning">Warning</Tag>
<Tag color="error">Error</Tag>
<Tag color="info">Info</Tag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag>Default</Tag>
          <Tag color="success">Success</Tag>
          <Tag color="warning">Warning</Tag>
          <Tag color="error">Error</Tag>
          <Tag color="info">Info</Tag>
        </div>
      </Example>

      <Example
        title="Bordered"
        code={`<Tag bordered color="success">Success</Tag>
<Tag bordered color="error">Error</Tag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag bordered>Default</Tag>
          <Tag bordered color="success">Success</Tag>
          <Tag bordered color="warning">Warning</Tag>
          <Tag bordered color="error">Error</Tag>
          <Tag bordered color="info">Info</Tag>
        </div>
      </Example>

      <Example
        title="Closable"
        description="closable 태그는 X 버튼으로 제거할 수 있습니다."
        code={`<Tag closable onClose={() => console.log('closed')}>Removable</Tag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag closable>Removable A</Tag>
          <Tag closable color="success">Removable B</Tag>
          <Tag closable color="error">Removable C</Tag>
        </div>
      </Example>

      <Example
        title="Icon"
        description="icon prop으로 태그 앞에 아이콘을 추가합니다."
        code={`import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

<Tag color="success" icon={<CheckCircle size={12} />}>Success</Tag>
<Tag color="warning" icon={<AlertTriangle size={12} />}>Warning</Tag>
<Tag color="error" icon={<XCircle size={12} />}>Error</Tag>
<Tag color="info" icon={<Info size={12} />}>Info</Tag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag color="success" icon={<CheckCircle size={12} />}>Success</Tag>
          <Tag color="warning" icon={<AlertTriangle size={12} />}>Warning</Tag>
          <Tag color="error" icon={<XCircle size={12} />}>Error</Tag>
          <Tag color="info" icon={<Info size={12} />}>Info</Tag>
        </div>
      </Example>

      <Example
        title="Custom Color"
        code={`<Tag color="#722ed1">Custom Purple</Tag>
<Tag color="#eb2f96">Custom Pink</Tag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag color="#722ed1">Custom Purple</Tag>
          <Tag color="#eb2f96">Custom Pink</Tag>
          <Tag color="#13c2c2">Custom Teal</Tag>
        </div>
      </Example>

      <Example
        title="CheckableTag"
        description="Tag.CheckableTag은 클릭으로 토글되는 버튼형 태그입니다."
        code={`<Tag.CheckableTag checked onChange={setChecked}>Checked</Tag.CheckableTag>
<Tag.CheckableTag>Unchecked</Tag.CheckableTag>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag.CheckableTag defaultChecked>React</Tag.CheckableTag>
          <Tag.CheckableTag>TypeScript</Tag.CheckableTag>
          <Tag.CheckableTag defaultChecked>CSS</Tag.CheckableTag>
          <Tag.CheckableTag>Node.js</Tag.CheckableTag>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'color', type: "TagColor | string", default: "'default'", description: "시맨틱 색상 또는 CSS 색상 값" },
          { name: 'closable', type: 'boolean', default: 'false', description: 'X 버튼 표시 (클릭 시 숨김)' },
          { name: 'bordered', type: 'boolean', default: 'false', description: '테두리 표시' },
          { name: 'icon', type: 'ReactNode', description: '앞 아이콘' },
          { name: 'onClose', type: '() => void', description: 'X 버튼 클릭 콜백' },
        ]}
      />

      <PropsTable
        title="Tag.CheckableTag Props"
        rows={[
          { name: 'checked', type: 'boolean', description: '선택 상태 (controlled)' },
          { name: 'defaultChecked', type: 'boolean', default: 'false', description: '초기 선택 상태' },
          { name: 'icon', type: 'ReactNode', description: '앞 아이콘' },
          { name: 'onChange', type: '(checked: boolean) => void', description: '토글 콜백' },
        ]}
      />
    </DocPage>
  );
}
