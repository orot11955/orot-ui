import { useState } from 'react';
import { Radio } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function RadioPage() {
  const [value, setValue] = useState<string | number>('a');

  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
    { label: 'Disabled', value: 'd', disabled: true },
  ];

  return (
    <DocPage title="Radio" description="여러 선택지 중 하나만 선택할 때 사용합니다.">
      <Example
        title="기본"
        code={`<Radio.Group options={options} value={value} onChange={setValue} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio.Group options={options} value={value} onChange={setValue} />
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-secondary)' }}>
            Selected: {value}
          </div>
        </div>
      </Example>

      <Example
        title="Button Style — Solid"
        description="buttonStyle='solid'은 선택된 항목을 채워진 배경으로 표시합니다."
        code={`<Radio.Group options={options} value={value} onChange={setValue} buttonStyle="solid" />`}
      >
        <Radio.Group
          options={options.slice(0, 3)}
          value={value}
          onChange={setValue}
          buttonStyle="solid"
        />
      </Example>

      <Example
        title="Button Style — Outline"
        description="buttonStyle='outline'은 선택된 항목을 테두리/색상만으로 강조합니다."
        code={`<Radio.Group options={options} value={value} onChange={setValue} buttonStyle="outline" />`}
      >
        <Radio.Group
          options={options.slice(0, 3)}
          value={value}
          onChange={setValue}
          buttonStyle="outline"
        />
      </Example>

      <Example
        title="optionType='button'"
        description="optionType='button'을 직접 사용하면 buttonStyle 없이도 버튼 형태가 됩니다."
        code={`<Radio.Group options={options} optionType="button" />`}
      >
        <Radio.Group options={options.slice(0, 3)} optionType="button" defaultValue="a" />
      </Example>

      <Example
        title="Size"
        description="Group의 size prop으로 버튼 크기를 조정합니다."
        code={`<Radio.Group options={options} buttonStyle="solid" size="sm" />
<Radio.Group options={options} buttonStyle="solid" size="md" />
<Radio.Group options={options} buttonStyle="solid" size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio.Group options={options.slice(0, 3)} buttonStyle="solid" size="sm" defaultValue="a" />
          <Radio.Group options={options.slice(0, 3)} buttonStyle="solid" size="md" defaultValue="a" />
          <Radio.Group options={options.slice(0, 3)} buttonStyle="solid" size="lg" defaultValue="a" />
        </div>
      </Example>

      <Example
        title="Block"
        description="block prop으로 Group이 부모 너비를 가득 채웁니다."
        code={`<Radio.Group options={options} buttonStyle="solid" block />`}
      >
        <Radio.Group options={options.slice(0, 3)} buttonStyle="solid" block defaultValue="a" />
      </Example>

      <Example
        title="독립 Radio"
        code={`<Radio value="x" checked>Checked</Radio>
<Radio value="y">Unchecked</Radio>
<Radio value="z" disabled>Disabled</Radio>`}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <Radio value="x" checked>Checked</Radio>
          <Radio value="y">Unchecked</Radio>
          <Radio value="z" disabled>Disabled</Radio>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: 'RadioOptionType[]', description: 'Group에서 옵션 배열' },
          { name: 'value', type: 'string | number', description: '선택된 값 (Group controlled)' },
          { name: 'defaultValue', type: 'string | number', description: '초기 선택 값 (Group)' },
          { name: 'optionType', type: "'default' | 'button'", default: "'default'", description: "버튼 형태 사용 여부. buttonStyle 지정 시 자동 'button'" },
          { name: 'buttonStyle', type: "'solid' | 'outline'", description: "버튼 checked 스타일. 'solid'=채움, 'outline'=테두리만" },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '버튼 크기 (button 타입 전용)' },
          { name: 'block', type: 'boolean', default: 'false', description: '부모 너비 전체 사용 (button 타입 전용)' },
          { name: 'disabled', type: 'boolean', description: '전체 비활성화 (Group) 또는 개별' },
          { name: 'name', type: 'string', description: '폼 연동용 name 속성' },
          { name: 'onChange', type: '(value: string | number) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
