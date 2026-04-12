import { Descriptions, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const BASIC_ITEMS = [
  { key: 'name',  label: '이름',     children: '홍길동' },
  { key: 'email', label: '이메일',   children: 'hong@example.com' },
  { key: 'phone', label: '전화번호', children: '010-1234-5678' },
  { key: 'role',  label: '직책',     children: '시니어 엔지니어' },
  { key: 'dept',  label: '부서',     children: '플랫폼 팀' },
  { key: 'date',  label: '입사일',   children: '2021-03-15' },
];

// column={2} 기반 span 예제 — 2열로 단순하게 유지
const SPAN_ITEMS = [
  { key: 'proj',  label: '프로젝트', children: 'orot-ui 디자인 시스템', span: 2 },
  { key: 'status',label: '상태',     children: '진행 중' },
  { key: 'owner', label: '담당자',   children: '홍길동' },
  { key: 'desc',  label: '설명',     children: '재사용 가능한 React UI 컴포넌트 라이브러리입니다.', span: 2 },
];

export default function DescriptionsPage() {
  return (
    <DocPage
      title="Descriptions"
      description="키-값 쌍의 항목을 그리드 형태로 정렬해 보여줍니다. 상세 정보 표시, 주문 요약, 프로필 뷰에 사용합니다."
    >
      <Example
        title="기본"
        code={`
const items = [
  { key: 'name',  label: '이름',     children: '홍길동' },
  { key: 'email', label: '이메일',   children: 'hong@example.com' },
  { key: 'phone', label: '전화번호', children: '010-1234-5678' },
];

<Descriptions items={items} title="사용자 정보" />
        `}
      >
        <Descriptions items={BASIC_ITEMS} title="사용자 정보" />
      </Example>

      <Example
        title="Bordered"
        description="bordered prop으로 테두리 있는 스타일을 적용합니다."
        code={`<Descriptions items={items} bordered title="사용자 정보" />`}
      >
        <Descriptions items={BASIC_ITEMS} bordered title="사용자 정보" />
      </Example>

      <Example
        title="Vertical Layout"
        description="layout='vertical'로 레이블과 값을 위아래로 배치합니다."
        code={`<Descriptions items={items} layout="vertical" bordered title="사용자 정보" />`}
      >
        <Descriptions items={BASIC_ITEMS} layout="vertical" bordered title="사용자 정보" />
      </Example>

      <Example
        title="Span"
        description="개별 항목의 span으로 차지할 열 수를 늘립니다. column={2} 기준."
        code={`
const items = [
  { key: 'proj',   label: '프로젝트', children: 'orot-ui', span: 2 },
  { key: 'status', label: '상태',     children: '진행 중' },
  { key: 'owner',  label: '담당자',   children: '홍길동' },
  { key: 'desc',   label: '설명',     children: '...', span: 2 },
];

<Descriptions items={items} column={2} bordered />
        `}
      >
        <Descriptions items={SPAN_ITEMS} column={2} bordered />
      </Example>

      <Example
        title="Size"
        code={`
<Descriptions items={items} size="sm" bordered title="Small" />
<Descriptions items={items} size="md" bordered title="Medium (기본)" />
<Descriptions items={items} size="lg" bordered title="Large" />
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Descriptions items={BASIC_ITEMS.slice(0, 3)} size="sm" bordered title="Small" />
          <Descriptions items={BASIC_ITEMS.slice(0, 3)} size="md" bordered title="Medium (기본)" />
          <Descriptions items={BASIC_ITEMS.slice(0, 3)} size="lg" bordered title="Large" />
        </div>
      </Example>

      <Example
        title="Extra"
        description="title 옆에 extra 영역을 추가합니다."
        code={`
<Descriptions
  items={items}
  title="사용자 정보"
  extra={<Button size="sm" variant="outlined">편집</Button>}
/>
        `}
      >
        <Descriptions
          items={BASIC_ITEMS}
          title="사용자 정보"
          extra={<Button size="sm" variant="outlined">편집</Button>}
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'DescriptionsItem[]', description: '표시할 항목 배열' },
          { name: 'title', type: 'ReactNode', description: '섹션 제목' },
          { name: 'extra', type: 'ReactNode', description: '제목 오른쪽 추가 영역' },
          { name: 'bordered', type: 'boolean', default: 'false', description: '테두리 스타일 적용' },
          { name: 'column', type: 'number', default: '3', description: '한 행의 열 수' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '패딩 크기' },
          { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '레이블-값 배치 방향' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />

      <PropsTable
        title="DescriptionsItem"
        rows={[
          { name: 'label', type: 'ReactNode', description: '레이블' },
          { name: 'children', type: 'ReactNode', description: '값' },
          { name: 'key', type: 'string', description: 'React key (선택)' },
          { name: 'span', type: 'number', default: '1', description: '차지할 열 수' },
        ]}
      />
    </DocPage>
  );
}
