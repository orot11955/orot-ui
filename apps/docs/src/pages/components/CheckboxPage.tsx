import { useState } from 'react';
import { Checkbox } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);
  const [groupValue, setGroupValue] = useState<string[]>(['apple', 'cherry']);

  return (
    <DocPage title="Checkbox" description="하나 이상의 선택지를 체크박스로 선택합니다.">
      <Example
        title="기본"
        code={`<Checkbox>Checkbox</Checkbox>
<Checkbox defaultChecked>Checked by default</Checkbox>
<Checkbox disabled>Disabled</Checkbox>
<Checkbox disabled defaultChecked>Disabled checked</Checkbox>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox>Checkbox</Checkbox>
          <Checkbox defaultChecked>Checked by default</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox disabled defaultChecked>Disabled checked</Checkbox>
        </div>
      </Example>

      <Example
        title="Controlled + Indeterminate"
        code={`const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onChange={setChecked}>{checked ? 'Checked' : 'Unchecked'}</Checkbox>
<Checkbox indeterminate>Indeterminate</Checkbox>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox checked={checked} onChange={setChecked}>
            {checked ? 'Checked' : 'Unchecked'}
          </Checkbox>
          <Checkbox indeterminate>Indeterminate</Checkbox>
        </div>
      </Example>

      <Example
        title="Group"
        description="Checkbox.Group으로 여러 체크박스를 그룹으로 관리합니다."
        code={`<Checkbox.Group
  options={[
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Durian (disabled)', value: 'durian', disabled: true },
  ]}
  value={groupValue}
  onChange={setGroupValue}
/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox.Group
            options={[
              { label: 'Apple', value: 'apple' },
              { label: 'Banana', value: 'banana' },
              { label: 'Cherry', value: 'cherry' },
              { label: 'Durian (disabled)', value: 'durian', disabled: true },
            ]}
            value={groupValue}
            onChange={setGroupValue}
          />
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-secondary)' }}>
            Selected: {groupValue.join(', ')}
          </div>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'checked', type: 'boolean', description: '체크 상태 (controlled)' },
          { name: 'defaultChecked', type: 'boolean', default: 'false', description: '초기 체크 상태' },
          { name: 'indeterminate', type: 'boolean', default: 'false', description: '중간 상태' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'onChange', type: '(checked: boolean) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
