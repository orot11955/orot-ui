import { Timeline } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const basicItems = [
  { children: 'Create a services site 2015-09-01' },
  { children: 'Solve initial network problems 2015-09-01' },
  { children: 'Technical testing 2015-09-01' },
  { children: 'Network problems being solved 2015-09-01' },
];

export default function TimelinePage() {
  return (
    <DocPage title="Timeline" description="시간 순서에 따른 이벤트를 표시하는 타임라인입니다.">
      <Example
        title="기본"
        code={`<Timeline items={[
  { children: 'Create a services site 2015-09-01' },
  { children: 'Solve initial network problems 2015-09-01' },
  { children: 'Technical testing 2015-09-01' },
]} />`}
      >
        <Timeline items={basicItems} />
      </Example>

      <Example
        title="Color"
        code={`<Timeline items={[
  { children: 'Success event', color: 'green' },
  { children: 'Error event', color: 'red' },
  { children: 'Warning event', color: 'orange' },
  { children: 'Gray event', color: 'gray' },
]} />`}
      >
        <Timeline
          items={[
            { children: 'Success event', color: 'green' },
            { children: 'Error event', color: 'red' },
            { children: 'Warning event', color: 'orange' },
            { children: 'Gray event', color: 'gray' },
          ]}
        />
      </Example>

      <Example
        title="Alternate Mode"
        code={`<Timeline mode="alternate" items={items} />`}
      >
        <Timeline
          mode="alternate"
          items={[
            { children: 'Create a services site', label: '2015-09-01' },
            { children: 'Solve initial network problems', label: '2015-09-01' },
            { children: 'Technical testing', label: '2015-09-01' },
            { children: 'Network problems being solved', label: '2015-09-01' },
          ]}
        />
      </Example>

      <Example
        title="Pending"
        code={`<Timeline pending="Recording..." items={items} />`}
      >
        <Timeline pending="Recording..." items={basicItems} />
      </Example>

      <Example
        title="Reverse"
        code={`<Timeline reverse items={items} />`}
      >
        <Timeline reverse items={basicItems} />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'TimelineItemProps[]', description: '타임라인 아이템 목록' },
          { name: 'mode', type: "'left' | 'alternate' | 'right'", default: "'left'", description: '표시 모드' },
          { name: 'pending', type: 'ReactNode | boolean', description: '진행 중인 마지막 항목' },
          { name: 'pendingDot', type: 'ReactNode', description: '진행 중 항목의 커스텀 도트' },
          { name: 'reverse', type: 'boolean', default: 'false', description: '역순 정렬' },
        ]}
      />
    </DocPage>
  );
}
