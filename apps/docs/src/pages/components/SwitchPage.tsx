import { useState } from 'react';
import { Switch } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function SwitchPage() {
  const [checked, setChecked] = useState(false);

  return (
    <DocPage title="Switch" description="두 가지 상태를 토글합니다. 활성화/비활성화 같은 즉각적인 설정 전환에 사용합니다.">
      <Example
        title="기본"
        code={`<Switch />
<Switch defaultChecked />`}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Switch />
          <Switch defaultChecked />
        </div>
      </Example>

      <Example
        title="Controlled"
        code={`const [checked, setChecked] = useState(false);
<Switch checked={checked} onChange={setChecked} />`}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Switch checked={checked} onChange={setChecked} />
          <span style={{ fontSize: 13, color: 'var(--orot-color-text-secondary)' }}>
            {checked ? 'ON' : 'OFF'}
          </span>
        </div>
      </Example>

      <Example
        title="Inner Text"
        code={`<Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
<Switch checkedChildren="✓" unCheckedChildren="✕" />`}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked />
          <Switch checkedChildren="✓" unCheckedChildren="✕" />
        </div>
      </Example>

      <Example
        title="Size + States"
        code={`<Switch size="sm" />
<Switch size="md" />
<Switch loading />
<Switch disabled />`}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Switch size="sm" defaultChecked />
          <Switch size="md" defaultChecked />
          <Switch loading />
          <Switch disabled />
          <Switch disabled defaultChecked />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'checked', type: 'boolean', description: '스위치 상태 (controlled)' },
          { name: 'defaultChecked', type: 'boolean', default: 'false', description: '초기 상태' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'loading', type: 'boolean', description: '로딩 중 상태' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '크기' },
          { name: 'checkedChildren', type: 'ReactNode', description: '켜진 상태 텍스트' },
          { name: 'unCheckedChildren', type: 'ReactNode', description: '꺼진 상태 텍스트' },
          { name: 'onChange', type: '(checked: boolean) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
