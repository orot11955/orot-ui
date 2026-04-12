import { Space, Divider, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const Box = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ padding: '8px 12px', background: 'var(--orot-color-bg-secondary)', border: '1px solid var(--orot-color-border)', borderRadius: 2, fontSize: 13, ...style }}>
    {children}
  </div>
);

export default function SpacePage() {
  return (
    <DocPage
      title="Space"
      description="컴포넌트 사이 간격을 일관되게 배치하는 컨테이너. 버튼 그룹, 인라인 입력 묶음 등에 사용합니다."
    >
      <Example
        title="기본 (horizontal)"
        code={`
<Space>
  <Button>버튼 1</Button>
  <Button variant="outlined">버튼 2</Button>
  <Button variant="text">버튼 3</Button>
</Space>
        `}
      >
        <Space>
          <Button>버튼 1</Button>
          <Button variant="outlined">버튼 2</Button>
          <Button variant="text">버튼 3</Button>
        </Space>
      </Example>

      <Example
        title="Size"
        description="sm(8px) / md(16px) / lg(24px) 또는 숫자(px)로 간격을 지정합니다."
        code={`
<Space size="sm"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
<Space size="md"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
<Space size="lg"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
<Space size={32}><Box>A</Box><Box>B</Box><Box>C</Box></Space>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Space size="sm"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
          <Space size="md"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
          <Space size="lg"><Box>A</Box><Box>B</Box><Box>C</Box></Space>
          <Space size={32}><Box>A</Box><Box>B</Box><Box>C</Box></Space>
        </div>
      </Example>

      <Example
        title="Vertical"
        code={`
<Space direction="vertical" size="md">
  <Box>첫 번째</Box>
  <Box>두 번째</Box>
  <Box>세 번째</Box>
</Space>
        `}
      >
        <Space direction="vertical" size="md">
          <Box>첫 번째</Box>
          <Box>두 번째</Box>
          <Box>세 번째</Box>
        </Space>
      </Example>

      <Example
        title="Split"
        description="split prop으로 아이템 사이에 구분 요소를 삽입합니다."
        code={`<Space split={<Divider type="vertical" />}><Box>A</Box><Box>B</Box><Box>C</Box></Space>`}
      >
        <Space split={<Divider type="vertical" />}>
          <Box>A</Box><Box>B</Box><Box>C</Box>
        </Space>
      </Example>

      <PropsTable
        rows={[
          { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '배치 방향' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'sm'", description: '아이템 간격' },
          { name: 'align', type: "'start' | 'end' | 'center' | 'baseline'", description: '교차축 정렬' },
          { name: 'wrap', type: 'boolean', default: 'false', description: '줄바꿈 허용' },
          { name: 'split', type: 'ReactNode', description: '아이템 사이 구분 요소' },
          { name: 'block', type: 'boolean', default: 'false', description: '부모 너비 전체 사용' },
        ]}
      />
    </DocPage>
  );
}
