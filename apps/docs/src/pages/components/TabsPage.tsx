import { useState } from 'react';
import { Tabs } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function TabsPage() {
  const [activeKey, setActiveKey] = useState('1');

  const items = [
    { key: '1', label: 'Tab 1', children: <p>Content of Tab 1</p> },
    { key: '2', label: 'Tab 2', children: <p>Content of Tab 2</p> },
    { key: '3', label: 'Tab 3', children: <p>Content of Tab 3</p>, disabled: true },
  ];

  return (
    <DocPage title="Tabs" description="탭을 통해 콘텐츠를 전환합니다. 동일한 레벨의 콘텐츠를 범주별로 나눌 때 사용합니다.">
      <Example
        title="기본"
        description="기본 line 타입 탭입니다."
        code={`const items = [
  { key: '1', label: 'Tab 1', children: <p>Content of Tab 1</p> },
  { key: '2', label: 'Tab 2', children: <p>Content of Tab 2</p> },
  { key: '3', label: 'Tab 3', children: <p>Content of Tab 3</p>, disabled: true },
];

<Tabs items={items} defaultActiveKey="1" />`}
      >
        <Tabs items={items} defaultActiveKey="1" />
      </Example>

      <Example
        title="Card 타입"
        description="카드 스타일의 탭입니다."
        code={`<Tabs type="card" items={items} defaultActiveKey="1" />`}
      >
        <Tabs type="card" items={items} defaultActiveKey="1" />
      </Example>

      <Example
        title="탭 위치"
        description="tabPosition으로 탭 바 위치를 지정합니다."
        code={`<Tabs tabPosition="left" items={items} defaultActiveKey="1" style={{ height: 150 }} />`}
      >
        <Tabs tabPosition="left" items={items} defaultActiveKey="1" style={{ height: 150 }} />
      </Example>

      <Example
        title="Centered"
        description="centered prop으로 탭 바를 중앙 정렬합니다."
        code={`<Tabs items={items} centered defaultActiveKey="1" />`}
      >
        <Tabs items={items} centered defaultActiveKey="1" />
      </Example>

      <Example
        title="Destroy On Hidden"
        description="destroyOnHidden을 켜면 비활성 탭의 DOM이 제거됩니다. 탭마다 초기 상태로 리셋되어야 할 때 유용합니다."
        code={`<Tabs items={items} destroyOnHidden defaultActiveKey="1" />`}
      >
        <Tabs items={items} destroyOnHidden defaultActiveKey="1" />
      </Example>

      <Example
        title="Controlled"
        description="activeKey와 onChange로 외부에서 탭 상태를 제어합니다."
        code={`const [activeKey, setActiveKey] = useState('1');
<Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />`}
      >
        <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'TabItem[]', description: '탭 아이템 배열. key, label, children 필수' },
          { name: 'activeKey', type: 'string', description: '현재 활성 탭 키 (controlled)' },
          { name: 'defaultActiveKey', type: 'string', description: '초기 활성 탭 키' },
          { name: 'type', type: "'line' | 'card'", default: "'line'", description: '탭 스타일' },
          { name: 'tabPosition', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: '탭 바 위치' },
          { name: 'centered', type: 'boolean', default: 'false', description: '탭 바 중앙 정렬' },
          { name: 'destroyOnHidden', type: 'boolean', default: 'false', description: '숨겨진 탭 DOM 제거' },
          { name: 'onChange', type: '(key: string) => void', description: '탭 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
