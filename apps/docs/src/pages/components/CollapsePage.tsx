import { Collapse } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const items = [
  { key: '1', label: 'What is orot-ui?', children: <p>orot-ui is a minimal React component library inspired by Ant Design, featuring a "bare markdown memo app" aesthetic.</p> },
  { key: '2', label: 'How to install?', children: <p>Run <code>npm install orot-ui</code> and import global styles in your entry file.</p> },
  { key: '3', label: 'Is it production ready?', children: <p>It is under active development. Use at your own discretion.</p>, extra: 'v0.1' },
  { key: '4', label: 'Disabled panel', children: <p>This panel is disabled.</p>, disabled: true },
];

export default function CollapsePage() {
  return (
    <DocPage title="Collapse" description="콘텐츠를 접고 펼 수 있는 아코디언 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<Collapse items={items} defaultActiveKey={['1']} />`}
      >
        <Collapse items={items} defaultActiveKey={['1']} />
      </Example>

      <Example
        title="Accordion"
        description="accordion 모드에서는 한 번에 하나만 열립니다."
        code={`<Collapse items={items} accordion defaultActiveKey={['1']} />`}
      >
        <Collapse items={items} accordion defaultActiveKey={['1']} />
      </Example>

      <Example
        title="Icon Position"
        code={`<Collapse items={items} expandIconPosition="end" />`}
      >
        <Collapse items={items.slice(0, 3)} expandIconPosition="end" />
      </Example>

      <Example
        title="No Border"
        code={`<Collapse items={items} bordered={false} />`}
      >
        <Collapse items={items.slice(0, 3)} bordered={false} />
      </Example>

      <Example
        title="Ghost"
        description="ghost 모드는 배경과 패딩이 없어 콘텐츠와 자연스럽게 통합됩니다."
        code={`<Collapse items={items} ghost defaultActiveKey={['1']} />`}
      >
        <Collapse items={items.slice(0, 3)} ghost defaultActiveKey={['1']} />
      </Example>

      <Example
        title="Size"
        description="sm / md / lg 크기로 헤더 패딩을 조정합니다."
        code={`<Collapse items={items} size="sm" />
<Collapse items={items} size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Collapse items={items.slice(0, 2)} size="sm" defaultActiveKey={['1']} />
          <Collapse items={items.slice(0, 2)} size="lg" defaultActiveKey={['1']} />
        </div>
      </Example>

      <Example
        title="collapsible 제어"
        description="collapsible='disabled'로 헤더 클릭을 비활성화하고, 아이템별 collapsible로 개별 제어합니다."
        code={`<Collapse
  items={[
    { key: '1', label: 'Always closed', children: <p>Click disabled</p>, collapsible: 'disabled' },
    { key: '2', label: 'Normal', children: <p>Clickable</p> },
  ]}
/>`}
      >
        <Collapse
          items={[
            { key: '1', label: 'Header click disabled', children: <p>collapsible="disabled"</p>, collapsible: 'disabled' },
            { key: '2', label: 'Normal panel', children: <p>클릭해서 펼칠 수 있습니다.</p> },
          ]}
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'CollapseItem[]', description: '패널 항목 배열. key, label, children 필수' },
          { name: 'activeKey', type: 'string | string[]', description: '열린 패널 키 (controlled)' },
          { name: 'defaultActiveKey', type: 'string | string[]', description: '초기 열린 패널 키' },
          { name: 'accordion', type: 'boolean', default: 'false', description: '동시에 하나만 열리는 아코디언 모드' },
          { name: 'bordered', type: 'boolean', default: 'true', description: '테두리 표시' },
          { name: 'ghost', type: 'boolean', default: 'false', description: '배경/패딩 없는 투명 모드' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '헤더/콘텐츠 패딩 크기' },
          { name: 'collapsible', type: "'header' | 'disabled'", default: "'header'", description: "전체 패널 클릭 제어. 'disabled'면 열기 불가" },
          { name: 'destroyOnHidden', type: 'boolean', default: 'true', description: '닫힐 때 콘텐츠 DOM 제거' },
          { name: 'expandIconPosition', type: "'start' | 'end'", default: "'start'", description: '화살표 위치' },
          { name: 'onChange', type: '(keys: string[]) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
