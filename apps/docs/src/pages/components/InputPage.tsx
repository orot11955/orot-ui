import { Search, Eye } from 'lucide-react';
import { Input } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function InputPage() {
  return (
    <DocPage title="Input" description="기본 텍스트 입력 컴포넌트.">
      <Example
        title="기본"
        code={`<Input placeholder="Enter text..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Input placeholder="Enter text..." />
        </div>
      </Example>

      <Example
        title="Prefix / Suffix"
        code={`<Input prefix={<Search size={14} />} placeholder="Search..." />
<Input suffix={<Eye size={14} />} placeholder="Password" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Input prefix={<Search size={14} />} placeholder="Search..." />
          <Input suffix={<Eye size={14} />} placeholder="Password" />
        </div>
      </Example>

      <Example
        title="Addon"
        code={`<Input addonBefore="https://" placeholder="example.com" />
<Input addonAfter=".com" placeholder="domain" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Input addonBefore="https://" placeholder="example.com" />
          <Input addonAfter=".com" placeholder="domain" />
        </div>
      </Example>

      <Example
        title="Allow Clear"
        code={`<Input allowClear defaultValue="Clear me" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Input allowClear defaultValue="Clear me" />
        </div>
      </Example>

      <Example
        title="Status"
        code={`<Input status="error" defaultValue="Error state" />
<Input status="warning" defaultValue="Warning state" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Input status="error" defaultValue="Error state" />
          <Input status="warning" defaultValue="Warning state" />
        </div>
      </Example>

      <Example
        title="Sizes"
        code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </div>
      </Example>

      <Example
        title="Show Count"
        description="showCount로 글자 수를 표시합니다. maxLength와 함께 사용하면 n/max 형식으로 표시됩니다."
        code={`<Input showCount maxLength={20} placeholder="20자 제한" />
<Input showCount placeholder="글자 수만 표시" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
          <Input showCount maxLength={20} placeholder="20자 제한" />
          <Input showCount placeholder="글자 수만 표시" />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Input disabled defaultValue="Disabled" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Input disabled defaultValue="Disabled input" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'prefix', type: 'ReactNode', description: '입력 필드 앞 요소' },
          { name: 'suffix', type: 'ReactNode', description: '입력 필드 뒤 요소' },
          { name: 'addonBefore', type: 'ReactNode', description: '앞 어드온' },
          { name: 'addonAfter', type: 'ReactNode', description: '뒤 어드온' },
          { name: 'allowClear', type: 'boolean', default: 'false', description: '지우기 버튼 표시' },
          { name: 'showCount', type: 'boolean', default: 'false', description: '글자 수 카운터 표시. maxLength와 함께 사용 시 n/max 형식' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'maxLength', type: 'number', description: '최대 입력 글자 수. showCount와 함께 사용' },
        ]}
      />
    </DocPage>
  );
}
