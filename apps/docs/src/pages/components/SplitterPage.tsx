import { useState } from 'react';
import { Splitter } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';
import './SplitterPage.css';

const PanelContent = ({ label }: { label: string }) => (
  <div className="splitter-panel-content">{label}</div>
);

function ControlledSplitterExample() {
  const [sizes, setSizes] = useState([24, 52, 24]);

  return (
    <div className="splitter-demo">
      <Splitter onResize={setSizes}>
        <Splitter.Panel size={sizes[0]} min={18} max={30} resizable={false}>
          <PanelContent label="고정 탐색" />
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]} min={35}>
          <PanelContent label={`에디터 ${Math.round(sizes[1])}%`} />
        </Splitter.Panel>
        <Splitter.Panel size={sizes[2]} min={18} max={35}>
          <PanelContent label={`미리보기 ${Math.round(sizes[2])}%`} />
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}

export default function SplitterPage() {
  return (
    <DocPage
      title="Splitter"
      description="패널 사이 크기를 드래그로 조절하는 분할 레이아웃. 에디터 좌우 패널, 탐색기/미리보기, IDE형 화면에 사용합니다."
    >
      <Example
        title="수평 분할 (horizontal)"
        description="divider를 드래그해서 좌우 패널 크기를 조절합니다."
        code={`
<Splitter style={{ height: 200 }}>
  <Splitter.Panel defaultSize={30} min={15}>
    <div>왼쪽 패널</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>오른쪽 패널</div>
  </Splitter.Panel>
</Splitter>
        `}
      >
        <div className="splitter-demo">
          <Splitter>
            <Splitter.Panel defaultSize={30} min={15}>
              <PanelContent label="왼쪽 패널" />
            </Splitter.Panel>
            <Splitter.Panel>
              <PanelContent label="오른쪽 패널" />
            </Splitter.Panel>
          </Splitter>
        </div>
      </Example>

      <Example
        title="수직 분할 (vertical)"
        description="orientation='vertical'로 상하 분할을 만듭니다."
        code={`
<Splitter orientation="vertical" style={{ height: 300 }}>
  <Splitter.Panel defaultSize={40}>
    <div>위 패널</div>
  </Splitter.Panel>
  <Splitter.Panel>
    <div>아래 패널</div>
  </Splitter.Panel>
</Splitter>
        `}
      >
        <div className="splitter-demo">
          <Splitter orientation="vertical">
            <Splitter.Panel defaultSize={40}>
              <PanelContent label="위 패널" />
            </Splitter.Panel>
            <Splitter.Panel>
              <PanelContent label="아래 패널" />
            </Splitter.Panel>
          </Splitter>
        </div>
      </Example>

      <Example
        title="세 패널"
        description="패널을 3개 이상 배치할 수 있습니다."
        code={`
<Splitter>
  <Splitter.Panel defaultSize={20} min={10}>탐색기</Splitter.Panel>
  <Splitter.Panel>에디터</Splitter.Panel>
  <Splitter.Panel defaultSize={25} min={15}>미리보기</Splitter.Panel>
</Splitter>
        `}
      >
        <div className="splitter-demo">
          <Splitter>
            <Splitter.Panel defaultSize={20} min={10}>
              <PanelContent label="탐색기" />
            </Splitter.Panel>
            <Splitter.Panel>
              <PanelContent label="에디터" />
            </Splitter.Panel>
            <Splitter.Panel defaultSize={25} min={15}>
              <PanelContent label="미리보기" />
            </Splitter.Panel>
          </Splitter>
        </div>
      </Example>

      <Example
        title="제약 있는 패널"
        description="min/max와 resizable=false를 조합하면 레이아웃 비율을 더 안정적으로 유지할 수 있습니다."
        code={`
const [sizes, setSizes] = useState([24, 52, 24]);

<Splitter onResize={setSizes}>
  <Splitter.Panel size={sizes[0]} min={18} max={30} resizable={false}>
    탐색
  </Splitter.Panel>
  <Splitter.Panel size={sizes[1]} min={35}>
    에디터
  </Splitter.Panel>
  <Splitter.Panel size={sizes[2]} min={18} max={35}>
    미리보기
  </Splitter.Panel>
</Splitter>
        `}
      >
        <ControlledSplitterExample />
      </Example>

      <PropsTable
        rows={[
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Splitter: 분할 방향' },
          { name: 'onResize', type: '(sizes: number[]) => void', description: 'Splitter: 크기 변경 콜백. sizes는 각 패널의 % 크기 배열' },
          { name: 'onResizeStart', type: '(sizes: number[]) => void', description: 'Splitter: 드래그 시작 콜백' },
          { name: 'onResizeEnd', type: '(sizes: number[]) => void', description: 'Splitter: 드래그 종료 콜백' },
          { name: 'size', type: 'number', description: 'Panel: 제어되는 크기 (%)' },
          { name: 'defaultSize', type: 'number', description: 'Panel: 초기 크기 (%). 미지정 시 남은 공간을 균등 배분' },
          { name: 'min', type: 'number', default: '0', description: 'Panel: 최소 크기 (%)' },
          { name: 'max', type: 'number', default: '100', description: 'Panel: 최대 크기 (%)' },
          { name: 'resizable', type: 'boolean', default: 'true', description: 'Panel: divider 드래그 허용 여부' },
        ]}
      />
    </DocPage>
  );
}
