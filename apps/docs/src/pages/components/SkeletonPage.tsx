import { Skeleton } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function SkeletonPage() {
  const blockStyle = { width: 'min(100%, 480px)' };

  return (
    <DocPage title="Skeleton" description="콘텐츠 로딩 중 플레이스홀더를 표시합니다.">
      <Example
        title="기본"
        code={`<Skeleton active />`}
      >
        <div style={blockStyle}>
          <Skeleton active />
        </div>
      </Example>

      <Example
        title="With Avatar"
        code={`<Skeleton active avatar />`}
      >
        <div style={blockStyle}>
          <Skeleton active avatar />
        </div>
      </Example>

      <Example
        title="Avatar square"
        code={`<Skeleton active avatar={{ shape: 'square' }} paragraph={{ rows: 2 }} />`}
      >
        <div style={blockStyle}>
          <Skeleton active avatar={{ shape: 'square' }} paragraph={{ rows: 2 }} />
        </div>
      </Example>

      <Example
        title="No animation"
        code={`<Skeleton avatar paragraph={{ rows: 3 }} />`}
      >
        <div style={blockStyle}>
          <Skeleton avatar paragraph={{ rows: 3 }} />
        </div>
      </Example>

      <Example
        title="Round"
        code={`<Skeleton active round avatar paragraph={{ rows: 2 }} />`}
      >
        <div style={blockStyle}>
          <Skeleton active round avatar paragraph={{ rows: 2 }} />
        </div>
      </Example>

      <Example
        title="Element Components"
        code={`<Skeleton.Button active />
<Skeleton.Avatar active />
<Skeleton.Input active block />
<Skeleton.Image active height={120} />`}
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Skeleton.Button active />
            <Skeleton.Button active shape="circle" />
            <Skeleton.Avatar active />
          </div>
          <Skeleton.Input active block />
          <Skeleton.Image active height={120} />
        </div>
      </Example>

      <Example
        title="As loading wrapper"
        description="loading={false}이면 children을 렌더링합니다."
        code={`<Skeleton loading={isLoading} active avatar>
  <div>Actual content here</div>
</Skeleton>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton loading={true} active avatar><div>Hidden content</div></Skeleton>
          <Skeleton loading={false} active avatar><div style={{ padding: 8, border: '1px solid var(--orot-color-border)', borderRadius: 4 }}>Loaded: actual content is visible</div></Skeleton>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'active', type: 'boolean', default: 'false', description: '셔머 애니메이션' },
          { name: 'loading', type: 'boolean', default: 'true', description: 'false이면 children 표시' },
          { name: 'avatar', type: 'boolean | object', default: 'false', description: '아바타 표시. { shape, size }' },
          { name: 'title', type: 'boolean | object', default: 'true', description: '제목 줄. { width }' },
          { name: 'paragraph', type: 'boolean | object', default: 'true', description: '본문 줄. { rows, width[] }' },
          { name: 'round', type: 'boolean', default: 'false', description: '라인/타이틀을 pill 형태로 렌더링' },
        ]}
      />

      <PropsTable
        title="Element Components"
        rows={[
          { name: 'Skeleton.Button', type: 'compound component', description: '버튼 형태 스켈레톤. active/size/shape/block 지원' },
          { name: 'Skeleton.Avatar', type: 'compound component', description: '아바타 형태 스켈레톤. active/size/shape 지원' },
          { name: 'Skeleton.Input', type: 'compound component', description: '입력창 형태 스켈레톤. active/size/block 지원' },
          { name: 'Skeleton.Image', type: 'compound component', description: '이미지 박스 스켈레톤. active/width/height 지원' },
        ]}
      />
    </DocPage>
  );
}
