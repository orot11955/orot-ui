import { Typography } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const { Title, Text, Paragraph, Link } = Typography;

export default function TypographyPage() {
  return (
    <DocPage
      title="Typography"
      description="텍스트 표현용 컴포넌트 집합. Title / Text / Paragraph / Link 네 가지 서브컴포넌트를 제공합니다."
    >
      <Example
        title="Title"
        description="h1~h6에 대응하는 제목 컴포넌트."
        code={`
<Typography.Title level={1}>H1. 제목 레벨 1</Typography.Title>
<Typography.Title level={2}>H2. 제목 레벨 2</Typography.Title>
<Typography.Title level={3}>H3. 제목 레벨 3</Typography.Title>
<Typography.Title level={4}>H4. 제목 레벨 4</Typography.Title>
<Typography.Title level={5}>H5. 제목 레벨 5</Typography.Title>
<Typography.Title level={6}>H6. 제목 레벨 6</Typography.Title>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
          <Title level={1}>H1. 제목 레벨 1</Title>
          <Title level={2}>H2. 제목 레벨 2</Title>
          <Title level={3}>H3. 제목 레벨 3</Title>
          <Title level={4}>H4. 제목 레벨 4</Title>
          <Title level={5}>H5. 제목 레벨 5</Title>
          <Title level={6}>H6. 제목 레벨 6</Title>
        </div>
      </Example>

      <Example
        title="Text — type"
        description="secondary / success / warning / danger 상태 색상을 지원합니다."
        code={`
<Text>기본 텍스트</Text>
<Text type="secondary">보조 텍스트</Text>
<Text type="success">성공 텍스트</Text>
<Text type="warning">경고 텍스트</Text>
<Text type="danger">위험 텍스트</Text>
<Text disabled>비활성 텍스트</Text>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text>기본 텍스트</Text>
          <Text type="secondary">보조 텍스트</Text>
          <Text type="success">성공 텍스트</Text>
          <Text type="warning">경고 텍스트</Text>
          <Text type="danger">위험 텍스트</Text>
          <Text disabled>비활성 텍스트</Text>
        </div>
      </Example>

      <Example
        title="Text — decoration"
        description="strong / italic / underline / delete / code / mark 속성을 조합할 수 있습니다."
        code={`
<Text strong>굵게</Text>
<Text italic>기울임</Text>
<Text underline>밑줄</Text>
<Text delete>취소선</Text>
<Text code>인라인 코드</Text>
<Text mark>마크 하이라이트</Text>
        `}
      >
        <Text strong>굵게</Text>
        <Text italic>기울임</Text>
        <Text underline>밑줄</Text>
        <Text delete>취소선</Text>
        <Text code>인라인 코드</Text>
        <Text mark>마크 하이라이트</Text>
      </Example>

      <Example
        title="Paragraph"
        description="블록 단위 문단 텍스트."
        code={`
<Typography.Paragraph>
  첫 번째 문단입니다. 마크다운 메모앱처럼 깔끔한 타이포그래피를 지향합니다.
</Typography.Paragraph>
<Typography.Paragraph type="secondary">
  두 번째 문단입니다. type="secondary"로 보조 색상을 사용합니다.
</Typography.Paragraph>
        `}
      >
        <div style={{ width: '100%' }}>
          <Paragraph>
            첫 번째 문단입니다. 마크다운 메모앱처럼 깔끔한 타이포그래피를 지향합니다.
          </Paragraph>
          <Paragraph type="secondary">
            두 번째 문단입니다. type="secondary"로 보조 색상을 사용합니다.
          </Paragraph>
        </div>
      </Example>

      <Example
        title="Link"
        description="외부 링크는 external prop을 사용해 새 탭에서 열립니다."
        code={`
<Typography.Link href="#">내부 링크</Typography.Link>
<Typography.Link href="#" external>외부 링크 (새 탭)</Typography.Link>
<Typography.Link disabled>비활성 링크</Typography.Link>
        `}
      >
        <Link href="#">내부 링크</Link>
        <Link href="#" external>외부 링크 (새 탭)</Link>
        <Link disabled>비활성 링크</Link>
      </Example>

      <PropsTable
        rows={[
          { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: '<Title> 헤딩 레벨' },
          { name: 'type', type: "'secondary' | 'success' | 'warning' | 'danger'", description: '텍스트 상태 색상' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화 스타일' },
          { name: 'ellipsis', type: 'boolean', default: 'false', description: '한 줄 말줄임 처리' },
          { name: 'code', type: 'boolean', default: 'false', description: '<Text> 인라인 코드 스타일' },
          { name: 'mark', type: 'boolean', default: 'false', description: '<Text> 하이라이트 마크' },
          { name: 'strong', type: 'boolean', default: 'false', description: '<Text> 굵게' },
          { name: 'italic', type: 'boolean', default: 'false', description: '<Text> 기울임' },
          { name: 'underline', type: 'boolean', default: 'false', description: '<Text> 밑줄' },
          { name: 'delete', type: 'boolean', default: 'false', description: '<Text> 취소선' },
          { name: 'external', type: 'boolean', default: 'false', description: '<Link> target="_blank" + rel="noopener noreferrer"' },
        ]}
      />
    </DocPage>
  );
}
