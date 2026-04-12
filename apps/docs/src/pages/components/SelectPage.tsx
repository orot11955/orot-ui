import { Select } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
];

export default function SelectPage() {
  return (
    <DocPage title="Select" description="옵션 목록에서 하나 또는 여러 항목을 선택합니다.">
      <Example
        title="기본"
        code={`<Select options={options} placeholder="Select fruit..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} placeholder="Select fruit..." />
        </div>
      </Example>

      <Example
        title="Multiple"
        code={`<Select options={options} mode="multiple" placeholder="Select fruits..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} mode="multiple" placeholder="Select fruits..." />
        </div>
      </Example>

      <Example
        title="Show Search"
        code={`<Select options={options} showSearch placeholder="Type to search..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} showSearch placeholder="Type to search..." />
        </div>
      </Example>

      <Example
        title="Multiple + Search"
        code={`<Select options={options} mode="multiple" showSearch placeholder="Search and select fruits..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} mode="multiple" showSearch placeholder="Search and select fruits..." />
        </div>
      </Example>

      <Example
        title="Allow Clear"
        code={`<Select options={options} allowClear defaultValue="apple" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} allowClear defaultValue="apple" />
        </div>
      </Example>

      <Example
        title="Loading"
        code={`<Select options={options} loading showSearch placeholder="Loading options..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Select options={options} loading showSearch placeholder="Loading options..." />
        </div>
      </Example>

      <Example
        title="Sizes"
        code={`<Select options={options} size="sm" />
<Select options={options} size="md" />
<Select options={options} size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Select options={options} size="sm" placeholder="Small" />
          <Select options={options} size="md" placeholder="Medium" />
          <Select options={options} size="lg" placeholder="Large" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: 'SelectOption[]', description: '선택 옵션 배열. value, label 필수' },
          { name: 'value', type: 'string | number | (string|number)[]', description: '선택된 값 (controlled)' },
          { name: 'defaultValue', type: 'string | number | (string|number)[]', description: '초기 선택 값' },
          { name: 'mode', type: "'multiple'", description: '다중 선택 모드' },
          { name: 'showSearch', type: 'boolean', default: 'false', description: '검색 input 표시' },
          { name: 'allowClear', type: 'boolean', default: 'false', description: '초기화 버튼 표시' },
          { name: 'loading', type: 'boolean', default: 'false', description: '드롭다운 로딩 상태' },
          { name: 'filterOption', type: 'boolean | (inputValue, option) => boolean', default: 'true', description: '검색 필터링 방식' },
          { name: 'optionFilterProp', type: "'label' | 'value'", default: "'label'", description: '검색 기준 필드' },
          { name: 'notFoundContent', type: 'ReactNode', description: '검색 결과 없을 때 표시할 내용' },
          { name: 'placeholder', type: 'string', description: '플레이스홀더' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'name', type: 'string', description: '폼 연동용 필드 이름' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: '열림 상태 변경 콜백' },
          { name: 'onSearch', type: '(value: string) => void', description: '검색어 변경 콜백' },
          { name: 'onChange', type: '(value) => void', description: '선택 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
