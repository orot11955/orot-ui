import { Empty, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function EmptyPage() {
  return (
    <DocPage
      title="Empty"
      description="데이터가 없을 때 빈 상태를 시각적으로 안내합니다. 목록, 테이블, 검색 결과 없음 등에 사용합니다."
    >
      <Example
        title="기본"
        code={`<Empty />`}
      >
        <Empty />
      </Example>

      <Example
        title="Simple"
        description="image='simple'로 더 작은 기본 이미지를 사용합니다."
        code={`<Empty image="simple" />`}
      >
        <Empty image="simple" />
      </Example>

      <Example
        title="커스텀 설명"
        code={`<Empty description="검색 결과가 없습니다" />`}
      >
        <Empty description="검색 결과가 없습니다" />
      </Example>

      <Example
        title="설명 숨김"
        code={`<Empty description={false} />`}
      >
        <Empty description={false} />
      </Example>

      <Example
        title="하위 콘텐츠 (children)"
        description="children으로 액션 버튼 등을 추가합니다."
        code={`
<Empty description="데이터가 없습니다">
  <Button size="sm">새로 만들기</Button>
</Empty>
        `}
      >
        <Empty description="데이터가 없습니다">
          <Button size="sm">새로 만들기</Button>
        </Empty>
      </Example>

      <Example
        title="커스텀 이미지"
        description="image prop에 ReactNode를 전달해 이미지를 교체합니다."
        code={`
<Empty
  image={<div style={{ fontSize: 48 }}>📭</div>}
  description="받은 메시지가 없습니다"
/>
        `}
      >
        <Empty
          image={<div style={{ fontSize: 48 }}>📭</div>}
          description="받은 메시지가 없습니다"
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'image', type: "ReactNode | 'default' | 'simple'", default: "'default'", description: "빈 상태 이미지. 'default' / 'simple' 또는 커스텀 노드" },
          { name: 'imageStyle', type: 'CSSProperties', description: '이미지 영역 인라인 스타일' },
          { name: 'description', type: 'ReactNode', description: '설명 텍스트. false이면 숨김' },
          { name: 'children', type: 'ReactNode', description: '설명 아래 추가 콘텐츠 (액션 버튼 등)' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
