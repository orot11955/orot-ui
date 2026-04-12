import { FloatButton } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function FloatButtonPage() {
  return (
    <DocPage title="FloatButton" description="화면에 고정된 부동 버튼입니다.">
      <Example
        title="기본"
        code={`<FloatButton icon="+" onClick={() => alert('clicked')} />`}
      >
        <div style={{ position: 'relative', height: 120, width: '100%', border: '1px dashed var(--orot-color-border)', borderRadius: 8 }}>
          <FloatButton
            icon="+"
            style={{ position: 'absolute', bottom: 16, right: 16 }}
            onClick={() => alert('clicked')}
          />
        </div>
      </Example>

      <Example
        title="Type"
        code={`<FloatButton type="default" icon="★" />
<FloatButton type="primary" icon="★" />`}
      >
        <div style={{ position: 'relative', height: 120, width: '100%', border: '1px dashed var(--orot-color-border)', borderRadius: 8 }}>
          <FloatButton
            icon="★"
            type="default"
            style={{ position: 'absolute', bottom: 16, right: 72 }}
          />
          <FloatButton
            icon="★"
            type="primary"
            style={{ position: 'absolute', bottom: 16, right: 16 }}
          />
        </div>
      </Example>

      <Example
        title="Square Shape"
        code={`<FloatButton shape="square" icon="↑" />`}
      >
        <div style={{ position: 'relative', height: 120, width: '100%', border: '1px dashed var(--orot-color-border)', borderRadius: 8 }}>
          <FloatButton
            icon="↑"
            shape="square"
            type="primary"
            style={{ position: 'absolute', bottom: 16, right: 16 }}
          />
        </div>
      </Example>

      <Example
        title="FloatButton.Group"
        description="그룹으로 묶어 클릭/호버 시 확장됩니다."
        code={`<FloatButton.Group trigger="click" icon="☰">
  <FloatButton icon="💬" />
  <FloatButton icon="📧" />
  <FloatButton icon="📞" />
</FloatButton.Group>`}
      >
        <div style={{ position: 'relative', height: 160, width: '100%', border: '1px dashed var(--orot-color-border)', borderRadius: 8 }}>
          <FloatButton.Group
            trigger="click"
            icon="☰"
            style={{ position: 'absolute', bottom: 16, right: 16 }}
          >
            <FloatButton icon="💬" tooltip="Chat" />
            <FloatButton icon="📧" tooltip="Email" />
            <FloatButton icon="📞" tooltip="Call" />
          </FloatButton.Group>
        </div>
      </Example>

      <Example
        title="BackTop"
        description="페이지 최상단으로 스크롤합니다."
        code={`<FloatButton.BackTop />`}
      >
        <div style={{ padding: 8, color: 'var(--orot-color-text-muted)' }}>
          FloatButton.BackTop은 페이지 하단에 고정되어 표시됩니다.
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'icon', type: 'ReactNode', description: '버튼 아이콘' },
          { name: 'description', type: 'ReactNode', description: '버튼 설명 텍스트' },
          { name: 'tooltip', type: 'ReactNode', description: '툴팁 내용' },
          { name: 'type', type: "'default' | 'primary'", default: "'default'", description: '버튼 타입' },
          { name: 'shape', type: "'circle' | 'square'", default: "'circle'", description: '버튼 모양' },
          { name: 'href', type: 'string', description: '링크 URL' },
          { name: 'badge', type: '{ count?, dot? }', description: '뱃지 설정' },
          { name: 'onClick', type: '() => void', description: '클릭 콜백' },
        ]}
      />
    </DocPage>
  );
}
