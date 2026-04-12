import { Spin } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function SpinPage() {
  return (
    <DocPage title="Spin" description="로딩 중인 상태를 나타내는 스피너 컴포넌트.">
      <Example
        title="기본"
        code={`<Spin />
<Spin size="sm" />
<Spin size="lg" />`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Spin size="sm" />
          <Spin size="md" />
          <Spin size="lg" />
        </div>
      </Example>

      <Example
        title="With Tip"
        code={`<Spin tip="Loading..." />`}
      >
        <Spin tip="Loading..." />
      </Example>

      <Example
        title="Wrapping content"
        description="children을 감싸면 오버레이로 로딩을 표시합니다."
        code={`<Spin spinning tip="Loading...">
  <div style={{ padding: 16, border: '1px solid var(--orot-color-border)' }}>
    Content being loaded...
  </div>
</Spin>`}
      >
        <Spin spinning tip="Loading...">
          <div style={{ padding: 24, border: '1px solid var(--orot-color-border)', borderRadius: 4, minHeight: 80 }}>
            <p>Content being loaded...</p>
            <p>Second line of content.</p>
          </div>
        </Spin>
      </Example>

      <Example
        title="Not spinning"
        code={`<Spin spinning={false}><div>Loaded!</div></Spin>`}
      >
        <Spin spinning={false}>
          <div style={{ padding: 24, border: '1px solid var(--orot-color-border)', borderRadius: 4 }}>
            Content loaded successfully!
          </div>
        </Spin>
      </Example>

      <Example
        title="Delay + Indicator"
        description="delay로 지연 표시하고 indicator로 커스텀 인디케이터를 사용할 수 있습니다."
        code={`<Spin delay={300} indicator={<span style={{ fontSize: 18 }}>⋯</span>} tip="Preparing..." />`}
      >
        <Spin delay={300} indicator={<span style={{ fontSize: 18, lineHeight: 1 }}>⋯</span>} tip="Preparing..." />
      </Example>

      <PropsTable
        rows={[
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '스피너 크기' },
          { name: 'tip', type: 'ReactNode', description: '로딩 텍스트' },
          { name: 'spinning', type: 'boolean', default: 'true', description: '로딩 중 여부' },
          { name: 'delay', type: 'number', default: '0', description: '표시 전 지연 시간 (ms)' },
          { name: 'fullscreen', type: 'boolean', default: 'false', description: '뷰포트 전체 오버레이 모드' },
          { name: 'indicator', type: 'ReactNode', description: '커스텀 인디케이터' },
          { name: 'children', type: 'ReactNode', description: '감쌀 콘텐츠 (오버레이 모드)' },
        ]}
      />
    </DocPage>
  );
}
