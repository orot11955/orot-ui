import { AutoComplete } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const options = [
  { value: 'apple' },
  { value: 'banana' },
  { value: 'cherry' },
  { value: 'durian' },
  { value: 'elderberry' },
];

export default function AutoCompletePage() {
  return (
    <DocPage title="AutoComplete" description="입력값 기반 자동완성 드롭다운을 제공합니다.">
      <Example
        title="기본"
        code={`<AutoComplete options={options} placeholder="과일 입력..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <AutoComplete options={options} placeholder="과일 입력..." />
        </div>
      </Example>

      <Example
        title="Allow Clear"
        code={`<AutoComplete options={options} allowClear defaultValue="apple" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <AutoComplete options={options} allowClear defaultValue="apple" />
        </div>
      </Example>

      <Example
        title="Custom Filter"
        code={`<AutoComplete
  options={options}
  filterOption={(input, opt) => opt.value.startsWith(input)}
  placeholder="시작 문자로 필터..."
/>`}
      >
        <div style={{ maxWidth: 300 }}>
          <AutoComplete
            options={options}
            filterOption={(input, opt) => opt.value.startsWith(input)}
            placeholder="시작 문자로 필터..."
          />
        </div>
      </Example>

      <Example
        title="Status"
        code={`<AutoComplete options={options} status="error" placeholder="Error" />
<AutoComplete options={options} status="warning" placeholder="Warning" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <AutoComplete options={options} status="error" placeholder="Error" />
          <AutoComplete options={options} status="warning" placeholder="Warning" />
        </div>
      </Example>

      <Example
        title="Sizes"
        code={`<AutoComplete options={options} size="sm" placeholder="Small" />
<AutoComplete options={options} size="md" placeholder="Medium" />
<AutoComplete options={options} size="lg" placeholder="Large" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <AutoComplete options={options} size="sm" placeholder="Small" />
          <AutoComplete options={options} size="md" placeholder="Medium" />
          <AutoComplete options={options} size="lg" placeholder="Large" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: 'AutoCompleteOption[]', default: '[]', description: '자동완성 옵션 목록' },
          { name: 'value', type: 'string', description: '제어 값' },
          { name: 'defaultValue', type: 'string', description: '초기 값' },
          { name: 'placeholder', type: 'string', description: '플레이스홀더' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'allowClear', type: 'boolean', description: '지우기 버튼 표시' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'filterOption', type: 'boolean | ((input, option) => boolean)', default: 'true', description: '옵션 필터 방식' },
          { name: 'onSelect', type: '(value, option) => void', description: '항목 선택 콜백' },
          { name: 'onChange', type: '(value) => void', description: '값 변경 콜백' },
          { name: 'onSearch', type: '(value) => void', description: '검색 입력 콜백' },
        ]}
      />
    </DocPage>
  );
}
