import { Tooltip, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function TooltipPage() {
  return (
    <DocPage title="Tooltip" description="호버/클릭/포커스 시 추가 정보를 표시하는 툴팁입니다.">
      <Example
        title="기본 (Hover)"
        code={`<Tooltip title="This is a tooltip">
  <Button variant="outlined">Hover me</Button>
</Tooltip>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tooltip title="This is a tooltip">
            <Button variant="outlined">Hover me</Button>
          </Tooltip>
          <Tooltip title="Click to show" trigger="click">
            <Button variant="outlined">Click me</Button>
          </Tooltip>
        </div>
      </Example>

      <Example
        title="Placement"
        description="12가지 위치를 지원합니다."
        code={`<Tooltip title="Top" placement="top"><Button>top</Button></Tooltip>
<Tooltip title="Bottom" placement="bottom"><Button>bottom</Button></Tooltip>
<Tooltip title="Left" placement="left"><Button>left</Button></Tooltip>
<Tooltip title="Right" placement="right"><Button>right</Button></Tooltip>`}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right'] as const).map(p => (
            <Tooltip key={p} title={`placement: ${p}`} placement={p}>
              <Button variant="outlined" size="sm">{p}</Button>
            </Tooltip>
          ))}
        </div>
      </Example>

      <Example
        title="Custom Color"
        description="color prop으로 툴팁 배경색을 지정합니다."
        code={`<Tooltip title="Custom color" color="var(--orot-color-info)">
  <Button variant="outlined">Blue</Button>
</Tooltip>
<Tooltip title="Custom color" color="#722ed1">
  <Button variant="outlined">Purple</Button>
</Tooltip>`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Tooltip title="Info tooltip" color="var(--orot-color-info)">
            <Button variant="outlined">Blue</Button>
          </Tooltip>
          <Tooltip title="Custom purple" color="#722ed1">
            <Button variant="outlined">Purple</Button>
          </Tooltip>
          <Tooltip title="Custom teal" color="#13c2c2">
            <Button variant="outlined">Teal</Button>
          </Tooltip>
        </div>
      </Example>

      <Example
        title="No Arrow"
        description="arrow={false}로 화살표를 숨깁니다."
        code={`<Tooltip title="No arrow" arrow={false}>
  <Button variant="outlined">No Arrow</Button>
</Tooltip>`}
      >
        <Tooltip title="No arrow tooltip" arrow={false}>
          <Button variant="outlined">No Arrow</Button>
        </Tooltip>
      </Example>

      <PropsTable
        rows={[
          { name: 'title', type: 'ReactNode', description: '툴팁 내용 (필수)' },
          { name: 'placement', type: 'TooltipPlacement', default: "'top'", description: '표시 위치 (12가지)' },
          { name: 'trigger', type: "'hover' | 'click' | 'focus'", default: "'hover'", description: '트리거 방식' },
          { name: 'open', type: 'boolean', description: '표시 여부 (controlled)' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: '초기 표시 여부' },
          { name: 'color', type: 'string', description: '툴팁 배경색 (CSS 값)' },
          { name: 'arrow', type: 'boolean', default: 'true', description: '화살표 표시 여부' },
          { name: 'mouseEnterDelay', type: 'number', default: '0', description: '마우스 진입 후 표시까지 지연 (초)' },
          { name: 'mouseLeaveDelay', type: 'number', default: '0.1', description: '마우스 이탈 후 숨김까지 지연 (초)' },
          { name: 'destroyOnHidden', type: 'boolean', default: 'true', description: '숨김 시 DOM 제거' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
