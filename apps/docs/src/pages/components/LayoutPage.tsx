import { useState } from 'react';
import { Layout } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';
import './LayoutPage.css';

const DemoLayout = () => (
  <div className="layout-demo">
    <Layout style={{ height: '100%' }}>
      <Layout.Header>Header</Layout.Header>
      <Layout.Content>Content</Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  </div>
);

const DemoLayoutSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="layout-demo">
      <Layout hasSider style={{ height: '100%' }}>
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <div className="layout-demo__nav">
            <div>메뉴 1</div>
            <div>메뉴 2</div>
            <div>메뉴 3</div>
          </div>
        </Layout.Sider>
        <Layout>
          <Layout.Header>Header</Layout.Header>
          <Layout.Content>Content</Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </Layout>
      </Layout>
    </div>
  );
};

const DemoResponsiveSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <div className="layout-demo">
      <Layout hasSider style={{ height: '100%' }}>
        <Layout.Sider
          width={220}
          collapsedWidth={0}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={setCollapsed}
          onBreakpoint={setBroken}
        >
          <div className="layout-demo__nav">
            <div>탐색</div>
            <div>문서</div>
            <div>설정</div>
          </div>
        </Layout.Sider>
        <Layout>
          <Layout.Header>{broken ? 'Mobile mode' : 'Desktop mode'}</Layout.Header>
          <Layout.Content>
            <div className="layout-demo__content">
              <strong>Responsive workspace</strong>
              <span>브레이크포인트 이하에서는 사이드바가 접히고, zero-width trigger로 다시 열 수 있습니다.</span>
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default function LayoutPage() {
  return (
    <DocPage
      title="Layout"
      description="앱 전체 골격을 위한 레이아웃 컴포넌트. Header / Sider / Content / Footer 서브컴포넌트를 조합해 대시보드·앱형 레이아웃을 구성합니다."
    >
      <Example
        title="기본 레이아웃"
        description="Header + Content + Footer 수직 구조."
        code={`
<Layout>
  <Layout.Header>Header</Layout.Header>
  <Layout.Content>Content</Layout.Content>
  <Layout.Footer>Footer</Layout.Footer>
</Layout>
        `}
      >
        <DemoLayout />
      </Example>

      <Example
        title="Sider 레이아웃"
        description="hasSider prop과 함께 사용. Sider의 collapsible 버튼으로 접고 펼칠 수 있습니다."
        code={`
const [collapsed, setCollapsed] = useState(false);

<Layout hasSider>
  <Layout.Sider
    collapsible
    collapsed={collapsed}
    onCollapse={setCollapsed}
  >
    사이드바 내용
  </Layout.Sider>
  <Layout>
    <Layout.Header>Header</Layout.Header>
    <Layout.Content>Content</Layout.Content>
    <Layout.Footer>Footer</Layout.Footer>
  </Layout>
</Layout>
        `}
      >
        <DemoLayoutSider />
      </Example>

      <Example
        title="Responsive Sider"
        description="breakpoint와 collapsedWidth=0을 함께 사용하면 좁은 영역에서 본문을 우선 확보하고, trigger로 다시 열 수 있습니다."
        code={`
const [collapsed, setCollapsed] = useState(false);
const [broken, setBroken] = useState(false);

<Layout hasSider>
  <Layout.Sider
    width={220}
    collapsedWidth={0}
    collapsible
    collapsed={collapsed}
    breakpoint="md"
    onCollapse={setCollapsed}
    onBreakpoint={setBroken}
  >
    사이드바 내용
  </Layout.Sider>
  <Layout>
    <Layout.Header>{broken ? 'Mobile mode' : 'Desktop mode'}</Layout.Header>
    <Layout.Content>Content</Layout.Content>
  </Layout>
</Layout>
        `}
      >
        <DemoResponsiveSider />
      </Example>

      <PropsTable
        rows={[
          { name: 'hasSider', type: 'boolean', default: 'false', description: 'Layout: Sider 포함 시 flex-direction: row로 전환' },
          { name: 'width', type: 'number | string', default: '220', description: 'Sider: 펼쳐진 너비' },
          { name: 'collapsedWidth', type: 'number | string', default: '48', description: 'Sider: 접힌 너비. 0이면 zero-width trigger와 함께 완전히 접힘' },
          { name: 'collapsible', type: 'boolean', default: 'false', description: 'Sider: 접기 버튼 표시' },
          { name: 'collapsed', type: 'boolean', description: 'Sider: 접힘 상태 (controlled)' },
          { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Sider: 초기 접힘 상태 (uncontrolled)' },
          { name: 'breakpoint', type: 'Breakpoint', description: 'Sider: 해당 브레이크포인트 미만에서 자동 접힘' },
          { name: 'onBreakpoint', type: '(broken: boolean) => void', description: 'Sider: 브레이크포인트 진입/이탈 콜백' },
          { name: 'reverseArrow', type: 'boolean', default: 'false', description: 'Sider: trigger 화살표 방향 반전' },
          { name: 'theme', type: "'light' | 'dark'", default: "'light'", description: 'Sider: 배경 톤 변형' },
          { name: 'trigger', type: 'ReactNode | null', description: 'Sider: 접기 버튼 커스터마이즈. null이면 버튼 제거' },
          { name: 'onCollapse', type: '(collapsed: boolean) => void', description: 'Sider: 접힘 상태 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
