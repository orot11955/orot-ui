import { Flex } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const Box = ({ label, style }: { label: string; style?: React.CSSProperties }) => (
  <div style={{ padding: '8px 16px', background: 'var(--orot-color-bg-secondary)', border: '1px solid var(--orot-color-border)', borderRadius: 2, fontSize: 13, flexShrink: 0, ...style }}>
    {label}
  </div>
);

export default function FlexPage() {
  return (
    <DocPage
      title="Flex"
      description="flexbox 기반 정렬·배치를 단순하게 다루는 레이아웃 래퍼. 수평/수직 정렬, 간격 제어를 선언적으로 표현합니다."
    >
      <Example
        title="justify"
        description="주축(가로) 방향 정렬을 제어합니다."
        code={`
<Flex justify="start"  gap="md">...</Flex>
<Flex justify="center" gap="md">...</Flex>
<Flex justify="end"    gap="md">...</Flex>
<Flex justify="space-between">...</Flex>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {(['start', 'center', 'end', 'space-between'] as const).map((j) => (
            <Flex key={j} justify={j} style={{ background: 'var(--orot-color-bg-secondary)', padding: 4, borderRadius: 2 }}>
              <Box label="A" /><Box label="B" /><Box label="C" />
            </Flex>
          ))}
        </div>
      </Example>

      <Example
        title="align"
        description="교차축(세로) 방향 정렬을 제어합니다."
        code={`
<Flex align="start"   gap="md" style={{ height: 60 }}>...</Flex>
<Flex align="center"  gap="md" style={{ height: 60 }}>...</Flex>
<Flex align="end"     gap="md" style={{ height: 60 }}>...</Flex>
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {(['start', 'center', 'end'] as const).map((a) => (
            <Flex key={a} align={a} gap="md" style={{ height: 60, background: 'var(--orot-color-bg-secondary)', borderRadius: 2 }}>
              <Box label="A" /><Box label="B" style={{ height: 40 }} /><Box label="C" style={{ height: 28 }} />
            </Flex>
          ))}
        </div>
      </Example>

      <Example
        title="vertical + gap"
        description="vertical prop으로 세로 방향 flex를 설정하고 gap으로 간격을 지정합니다."
        code={`
<Flex vertical gap="md">
  <Box label="첫 번째" />
  <Box label="두 번째" />
  <Box label="세 번째" />
</Flex>
        `}
      >
        <Flex vertical gap="md">
          <Box label="첫 번째" /><Box label="두 번째" /><Box label="세 번째" />
        </Flex>
      </Example>

      <Example
        title="wrap"
        description="wrap prop으로 줄바꿈을 허용합니다."
        code={`
<Flex wrap gap="sm" style={{ width: 300 }}>
  {Array.from({ length: 8 }, (_, i) => <Box key={i} label={String(i + 1)} />)}
</Flex>
        `}
      >
        <Flex wrap gap="sm" style={{ width: 300 }}>
          {Array.from({ length: 8 }, (_, i) => <Box key={i} label={String(i + 1)} />)}
        </Flex>
      </Example>

      <PropsTable
        rows={[
          { name: 'vertical', type: 'boolean', default: 'false', description: 'flex-direction: column' },
          { name: 'justify', type: "'start'|'end'|'center'|'space-between'|'space-around'|'space-evenly'", description: 'justify-content 값' },
          { name: 'align', type: "'start'|'end'|'center'|'baseline'|'stretch'", description: 'align-items 값' },
          { name: 'gap', type: "'sm' | 'md' | 'lg' | number", description: '아이템 간격' },
          { name: 'wrap', type: "boolean | 'wrap' | 'nowrap' | 'wrap-reverse'", default: 'false', description: 'flex-wrap 값' },
          { name: 'flex', type: 'string | number', description: '자기 자신의 flex 속성 값' },
          { name: 'as', type: 'ElementType', default: "'div'", description: '렌더링할 HTML 태그' },
        ]}
      />
    </DocPage>
  );
}
