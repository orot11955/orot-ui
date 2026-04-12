import { useState } from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function ButtonPage() {
  const [loading, setLoading] = useState(false);

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <DocPage
      title="Button"
      description="사용자의 명시적 액션을 실행하는 기본 버튼. 저장, 제출, 이동, 확인 등 거의 모든 트리거 액션에 사용합니다."
    >
      <Example
        title="Variant"
        description="4가지 시각 스타일을 제공합니다."
        code={`
<Button variant="solid">Solid</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
<Button variant="link">Link</Button>
        `}
      >
        <Button variant="solid">Solid</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="text">Text</Button>
        <Button variant="link">Link</Button>
      </Example>

      <Example
        title="Size"
        description="sm / md / lg 세 가지 크기를 지원합니다."
        code={`
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
        `}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Example>

      <Example
        title="Icon"
        description="icon prop으로 lucide-react 아이콘을 추가합니다. iconPlacement로 위치를 설정합니다."
        code={`
import { Search, Plus, ArrowRight } from 'lucide-react';

<Button icon={<Search size={14} />}>검색</Button>
<Button icon={<Plus size={14} />} variant="outlined">추가</Button>
<Button icon={<ArrowRight size={14} />} iconPlacement="end" variant="text">다음</Button>
<Button icon={<Plus size={16} />} variant="outlined" />
        `}
      >
        <Button icon={<Search size={14} />}>검색</Button>
        <Button icon={<Plus size={14} />} variant="outlined">추가</Button>
        <Button icon={<ArrowRight size={14} />} iconPlacement="end" variant="text">다음</Button>
        <Button icon={<Plus size={16} />} variant="outlined" />
      </Example>

      <Example
        title="Loading"
        description="loading 상태일 때 버튼이 비활성화되고 스피너가 표시됩니다."
        code={`
const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
  클릭해서 로딩
</Button>
<Button loading variant="outlined">Loading</Button>
        `}
      >
        <Button loading={loading} onClick={handleLoadingClick}>
          클릭해서 로딩
        </Button>
        <Button loading variant="outlined">Loading</Button>
      </Example>

      <Example
        title="Disabled"
        description="disabled 상태에서는 모든 상호작용이 차단됩니다."
        code={`
<Button disabled>Solid</Button>
<Button disabled variant="outlined">Outlined</Button>
<Button disabled variant="text">Text</Button>
        `}
      >
        <Button disabled>Solid</Button>
        <Button disabled variant="outlined">Outlined</Button>
        <Button disabled variant="text">Text</Button>
      </Example>

      <Example
        title="Block"
        description="block prop으로 부모 너비에 꽉 차게 만들 수 있습니다."
        code={`<Button block>Block Button</Button>`}
      >
        <div style={{ width: '100%' }}>
          <Button block>Block Button</Button>
        </div>
      </Example>

      <Example
        title="Danger"
        description="danger prop으로 위험 동작을 강조하는 적색 계열 스타일을 적용합니다."
        code={`<Button danger>Danger Solid</Button>
<Button danger variant="outlined">Danger Outlined</Button>
<Button danger variant="text">Danger Text</Button>`}
      >
        <Button danger>Danger Solid</Button>
        <Button danger variant="outlined">Danger Outlined</Button>
        <Button danger variant="text">Danger Text</Button>
      </Example>

      <Example
        title="Ghost"
        description="ghost prop은 배경을 투명하게 하고 흰 텍스트/테두리를 적용합니다. 어두운 배경 위에 올릴 때 사용합니다."
        code={`<Button ghost>Ghost Solid</Button>
<Button ghost variant="outlined">Ghost Outlined</Button>
<Button ghost variant="text">Ghost Text</Button>`}
      >
        <div style={{ display: 'flex', gap: 8, background: 'var(--orot-color-primary)', padding: '12px 16px', borderRadius: 6 }}>
          <Button ghost>Ghost Solid</Button>
          <Button ghost variant="outlined">Ghost Outlined</Button>
          <Button ghost variant="text">Ghost Text</Button>
        </div>
      </Example>

      <Example
        title="Shape"
        description="shape으로 버튼 모서리 형태를 변경합니다."
        code={`<Button shape="default">Default</Button>
<Button shape="round">Round</Button>
<Button shape="circle" icon={<Plus size={14} />} />`}
      >
        <Button shape="default">Default</Button>
        <Button shape="round">Round</Button>
        <Button shape="circle" icon={<Plus size={14} />} />
      </Example>

      <PropsTable
        rows={[
          { name: 'variant', type: "'solid' | 'outlined' | 'text' | 'link'", default: "'solid'", description: '버튼 시각 스타일' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '버튼 크기' },
          { name: 'shape', type: "'default' | 'circle' | 'round'", default: "'default'", description: '버튼 모서리 형태. circle은 정원형 아이콘 버튼' },
          { name: 'loading', type: 'boolean', default: 'false', description: '로딩 상태. true이면 스피너 표시 및 disabled 처리' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화' },
          { name: 'icon', type: 'ReactNode', description: '버튼 내부 아이콘. children 없이 단독 사용 시 정사각형 버튼이 됨' },
          { name: 'iconPlacement', type: "'start' | 'end'", default: "'start'", description: '아이콘 위치' },
          { name: 'iconPosition', type: "'start' | 'end'", description: 'iconPlacement의 alias' },
          { name: 'block', type: 'boolean', default: 'false', description: '부모 너비 전체 사용' },
          { name: 'danger', type: 'boolean', default: 'false', description: '위험 동작 강조 — 적색 계열 스타일' },
          { name: 'ghost', type: 'boolean', default: 'false', description: '투명 배경 + 흰 텍스트/테두리. 어두운 배경 위에 사용' },
          { name: 'htmlType', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '네이티브 버튼 type 속성' },
          { name: 'onClick', type: 'MouseEventHandler', description: '클릭 이벤트' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
