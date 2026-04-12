import { Row, Col } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';
import './GridPage.css';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className="grid-cell">{children}</div>
);

export default function GridPage() {
  return (
    <DocPage
      title="Grid"
      description="24칸 기준 반응형 그리드 시스템. Row + Col 조합으로 페이지/카드/폼 레이아웃을 열 단위로 구성합니다."
    >
      <Example
        title="기본 Grid"
        description="span으로 24칸 중 차지할 칸 수를 지정합니다."
        code={`
<Row>
  <Col span={24}><Cell>span=24</Cell></Col>
</Row>
<Row>
  <Col span={12}><Cell>span=12</Cell></Col>
  <Col span={12}><Cell>span=12</Cell></Col>
</Row>
<Row>
  <Col span={8}><Cell>span=8</Cell></Col>
  <Col span={8}><Cell>span=8</Cell></Col>
  <Col span={8}><Cell>span=8</Cell></Col>
</Row>
<Row>
  <Col span={6}><Cell>6</Cell></Col>
  <Col span={6}><Cell>6</Cell></Col>
  <Col span={6}><Cell>6</Cell></Col>
  <Col span={6}><Cell>6</Cell></Col>
</Row>
        `}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row><Col span={24}><Cell>span=24</Cell></Col></Row>
          <Row><Col span={12}><Cell>span=12</Cell></Col><Col span={12}><Cell>span=12</Cell></Col></Row>
          <Row><Col span={8}><Cell>8</Cell></Col><Col span={8}><Cell>8</Cell></Col><Col span={8}><Cell>8</Cell></Col></Row>
          <Row><Col span={6}><Cell>6</Cell></Col><Col span={6}><Cell>6</Cell></Col><Col span={6}><Cell>6</Cell></Col><Col span={6}><Cell>6</Cell></Col></Row>
        </div>
      </Example>

      <Example
        title="Gutter"
        description="gutter로 열 간격, [수평, 수직] 배열로 양방향 간격을 설정합니다."
        code={`
<Row gutter={16}>
  <Col span={8}><Cell>A</Cell></Col>
  <Col span={8}><Cell>B</Cell></Col>
  <Col span={8}><Cell>C</Cell></Col>
</Row>
<Row gutter={[16, 12]}>
  {Array.from({ length: 6 }, (_, i) => (
    <Col key={i} span={8}><Cell>{i + 1}</Cell></Col>
  ))}
</Row>
        `}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Row gutter={16}>
            <Col span={8}><Cell>A</Cell></Col>
            <Col span={8}><Cell>B</Cell></Col>
            <Col span={8}><Cell>C</Cell></Col>
          </Row>
          <Row gutter={[16, 12]}>
            {Array.from({ length: 6 }, (_, i) => (
              <Col key={i} span={8}><Cell>{i + 1}</Cell></Col>
            ))}
          </Row>
        </div>
      </Example>

      <Example
        title="Offset"
        description="offset으로 시작 위치를 밀어냅니다."
        code={`
<Row gutter={8}>
  <Col span={8}><Cell>span=8</Cell></Col>
  <Col span={8} offset={8}><Cell>span=8 offset=8</Cell></Col>
</Row>
        `}
      >
        <Row gutter={8}>
          <Col span={8}><Cell>span=8</Cell></Col>
          <Col span={8} offset={8}><Cell>span=8 offset=8</Cell></Col>
        </Row>
      </Example>

      <Example
        title="반응형"
        description="xs/sm/md/lg/xl/xxl prop으로 브레이크포인트별 칸 수를 지정합니다. 모바일에서는 xs=24로 한 줄씩 쌓입니다."
        code={`
<Row gutter={8}>
  <Col xs={24} sm={12} md={8} lg={6}><Cell>xs=24 sm=12 md=8 lg=6</Cell></Col>
  <Col xs={24} sm={12} md={8} lg={6}><Cell>xs=24 sm=12 md=8 lg=6</Cell></Col>
  <Col xs={24} sm={12} md={8} lg={6}><Cell>xs=24 sm=12 md=8 lg=6</Cell></Col>
  <Col xs={24} sm={12} md={8} lg={6}><Cell>xs=24 sm=12 md=8 lg=6</Cell></Col>
</Row>
        `}
      >
        <Row gutter={8}>
          {Array.from({ length: 4 }, (_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Cell>xs=24 sm=12 md=8 lg=6</Cell>
            </Col>
          ))}
        </Row>
      </Example>

      <Example
        title="Flex Columns + Responsive Gutter"
        description="Col의 flex와 Row의 반응형 gutter를 함께 사용하면 카드 레이아웃처럼 유연하게 늘어나면서도 간격이 안정적으로 유지됩니다."
        code={`
<Row gutter={[{ xs: 8, md: 16 }, { xs: 8, md: 16 }]}>
  <Col xs={24} md={{ span: 10, flex: '1 1 260px' }}><Cell>Primary</Cell></Col>
  <Col xs={24} md={{ span: 14, flex: '1 1 320px' }}><Cell>Secondary</Cell></Col>
</Row>
        `}
      >
        <Row gutter={[{ xs: 8, md: 16 }, { xs: 8, md: 16 }]}>
          <Col xs={24} md={{ span: 10, flex: '1 1 260px' }}>
            <Cell>Primary</Cell>
          </Col>
          <Col xs={24} md={{ span: 14, flex: '1 1 320px' }}>
            <Cell>Secondary</Cell>
          </Col>
        </Row>
      </Example>

      <PropsTable
        rows={[
          { name: 'gutter', type: 'number | ResponsiveNumber | [ResponsiveNumber, ResponsiveNumber]', description: 'Row: 열 간격 (px). 배열이면 [수평, 수직], 반응형 값도 지원' },
          { name: 'justify', type: "'start'|'end'|'center'|'space-around'|'space-between'|'space-evenly'", description: 'Row: justify-content' },
          { name: 'align', type: "'top'|'middle'|'bottom'|'stretch'", description: 'Row: align-items' },
          { name: 'wrap', type: 'boolean', default: 'true', description: 'Row: 줄바꿈 여부' },
          { name: 'span', type: 'number', default: '24', description: 'Col: 24칸 중 차지할 칸 수' },
          { name: 'offset', type: 'number', default: '0', description: 'Col: 시작 오프셋 칸 수' },
          { name: 'order', type: 'number', description: 'Col: flex order' },
          { name: 'flex', type: 'string | number', description: 'Col: 고정 span 대신 유연한 basis/grow/shrink 제어' },
          { name: 'xs/sm/md/lg/xl/xxl', type: 'number | ColResponsiveConfig', description: 'Col: 브레이크포인트별 설정' },
        ]}
      />
    </DocPage>
  );
}
