import { useState } from 'react';
import { Mentions } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const USER_OPTIONS = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
  { value: 'dave', label: 'Dave' },
];

const TOPIC_OPTIONS = [
  { value: 'react' },
  { value: 'typescript' },
  { value: 'design-system' },
  { value: 'accessibility' },
];

export default function MentionsPage() {
  const [value, setValue] = useState('');

  return (
    <DocPage
      title="Mentions"
      description="트리거 문자(@, # 등)를 입력하면 드롭다운에서 후보를 선택해 삽입합니다."
    >
      <Example
        title="기본 (@)"
        code={`
const options = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
];

<Mentions options={options} placeholder="@를 입력해 멤버를 멘션하세요" />
        `}
      >
        <Mentions
          options={USER_OPTIONS}
          placeholder="@를 입력해 멤버를 멘션하세요"
        />
      </Example>

      <Example
        title="복수 트리거 (@ / #)"
        description="prefix를 배열로 지정하면 여러 트리거 문자를 동시에 사용할 수 있습니다."
        code={`
<Mentions
  prefix={['@', '#']}
  options={[...userOptions, ...topicOptions]}
  placeholder="@ 또는 # 을 입력해 보세요"
/>
        `}
      >
        <Mentions
          prefix={['@', '#']}
          options={[...USER_OPTIONS, ...TOPIC_OPTIONS]}
          placeholder="@ 또는 # 을 입력해 보세요"
        />
      </Example>

      <Example
        title="Controlled"
        code={`
const [value, setValue] = useState('');

<Mentions
  value={value}
  onChange={setValue}
  options={options}
  placeholder="멘션을 입력하세요"
/>
<div>현재 값: {value}</div>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Mentions
            value={value}
            onChange={setValue}
            options={USER_OPTIONS}
            placeholder="멘션을 입력하세요"
          />
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-muted)' }}>
            현재 값: {value || '(없음)'}
          </div>
        </div>
      </Example>

      <Example
        title="Rows & autoSize"
        description="rows로 초기 높이를 지정하거나 autoSize로 내용에 맞게 자동 확장합니다."
        code={`
<Mentions options={options} rows={4} placeholder="rows={4}" />
<Mentions options={options} autoSize={{ minRows: 2, maxRows: 6 }} placeholder="autoSize" />
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Mentions options={USER_OPTIONS} rows={4} placeholder="rows={4}" />
          <Mentions
            options={USER_OPTIONS}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="autoSize: 최소 2줄, 최대 6줄"
          />
        </div>
      </Example>

      <Example
        title="Status & Disabled"
        code={`
<Mentions options={options} status="error" placeholder="오류 상태" />
<Mentions options={options} status="warning" placeholder="경고 상태" />
<Mentions options={options} disabled placeholder="비활성화" />
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Mentions options={USER_OPTIONS} status="error" placeholder="오류 상태" />
          <Mentions options={USER_OPTIONS} status="warning" placeholder="경고 상태" />
          <Mentions options={USER_OPTIONS} disabled placeholder="비활성화" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: 'MentionOption[]', description: '후보 목록. value 필수, label 선택' },
          { name: 'prefix', type: 'string | string[]', default: "'@'", description: '트리거 문자. 배열로 복수 지정 가능' },
          { name: 'value', type: 'string', description: '입력값 (controlled)' },
          { name: 'defaultValue', type: 'string', description: '초기 입력값' },
          { name: 'placeholder', type: 'string', description: '플레이스홀더' },
          { name: 'rows', type: 'number', description: '초기 행 수' },
          { name: 'autoSize', type: 'boolean | { minRows? maxRows? }', description: '높이 자동 조절' },
          { name: 'allowClear', type: 'boolean', description: '전체 초기화 버튼 표시' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'status', type: "'error' | 'warning' | ''", description: '유효성 상태' },
          { name: 'split', type: 'string', description: '삽입 후 뒤에 붙는 구분자. 기본 공백' },
          { name: 'onChange', type: '(value: string) => void', description: '값 변경 콜백' },
          { name: 'onSelect', type: '(option, prefix) => void', description: '옵션 선택 콜백' },
          { name: 'onSearch', type: '(text, prefix) => void', description: '검색어 변경 콜백' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
