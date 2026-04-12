import { Segmented } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function SegmentedPage() {
  return (
    <DocPage title="Segmented" description="분할된 버튼 그룹으로 단일 선택을 제공합니다.">
      <Example
        title="기본"
        code={`<Segmented options={['Daily', 'Weekly', 'Monthly']} />`}
      >
        <Segmented options={['Daily', 'Weekly', 'Monthly']} />
      </Example>

      <Example
        title="Block"
        description="block 모드에서 전체 너비를 채웁니다."
        code={`<Segmented options={['Map', 'Transit', 'Satellite']} block />`}
      >
        <Segmented options={['Map', 'Transit', 'Satellite']} block />
      </Example>

      <Example
        title="Size"
        code={`<Segmented options={['A', 'B', 'C']} size="sm" />
<Segmented options={['A', 'B', 'C']} size="md" />
<Segmented options={['A', 'B', 'C']} size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <Segmented options={['A', 'B', 'C']} size="sm" />
          <Segmented options={['A', 'B', 'C']} size="md" />
          <Segmented options={['A', 'B', 'C']} size="lg" />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Segmented options={['A', 'B', 'C']} disabled />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Segmented options={['A', 'B', 'C']} disabled />
          <Segmented
            options={[
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B', disabled: true },
              { value: 'c', label: 'C' },
            ]}
          />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: '(string | number | SegmentedOption)[]', description: '선택 항목 (필수)' },
          { name: 'value', type: 'string | number', description: '선택된 값 (controlled)' },
          { name: 'defaultValue', type: 'string | number', description: '초기 선택값' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '전체 비활성화' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'block', type: 'boolean', default: 'false', description: '전체 너비 채우기' },
          { name: 'onChange', type: '(value: string | number) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
