import { Slider } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function SliderPage() {
  return (
    <DocPage title="Slider" description="슬라이더로 범위 내에서 값을 선택합니다.">
      <Example
        title="기본"
        code={`<Slider defaultValue={30} />`}
      >
        <div style={{ padding: '8px 0' }}>
          <Slider defaultValue={30} />
        </div>
      </Example>

      <Example
        title="Range"
        code={`<Slider range defaultValue={[20, 70]} />`}
      >
        <div style={{ padding: '8px 0' }}>
          <Slider range defaultValue={[20, 70]} />
        </div>
      </Example>

      <Example
        title="Step"
        code={`<Slider step={10} defaultValue={40} />`}
      >
        <div style={{ padding: '8px 0' }}>
          <Slider step={10} defaultValue={40} />
        </div>
      </Example>

      <Example
        title="Marks"
        code={`<Slider
  marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
  defaultValue={37}
/>`}
      >
        <div style={{ padding: '8px 0 32px' }}>
          <Slider
            marks={{ 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }}
            defaultValue={37}
          />
        </div>
      </Example>

      <Example
        title="Dots"
        code={`<Slider step={10} dots defaultValue={30} />`}
      >
        <div style={{ padding: '8px 0' }}>
          <Slider step={10} dots defaultValue={30} />
        </div>
      </Example>

      <Example
        title="Vertical"
        code={`<Slider vertical defaultValue={40} style={{ height: 150 }} />`}
      >
        <div style={{ height: 160, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
          <Slider vertical defaultValue={40} style={{ height: 150 }} />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Slider disabled defaultValue={50} />`}
      >
        <div style={{ padding: '8px 0' }}>
          <Slider disabled defaultValue={50} />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'number | [number, number]', description: '제어 값' },
          { name: 'defaultValue', type: 'number | [number, number]', description: '초기 값' },
          { name: 'min', type: 'number', default: '0', description: '최솟값' },
          { name: 'max', type: 'number', default: '100', description: '최댓값' },
          { name: 'step', type: 'number | null', default: '1', description: '스텝. null이면 자유 이동' },
          { name: 'range', type: 'boolean', default: 'false', description: '범위 선택 모드' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'vertical', type: 'boolean', description: '세로 방향' },
          { name: 'marks', type: 'SliderMarks', description: '눈금 표시' },
          { name: 'dots', type: 'boolean', description: '스텝 위치에 점 표시' },
          { name: 'included', type: 'boolean', default: 'true', description: '채우기 영역 표시' },
          { name: 'tooltip', type: '{ formatter?, open? }', description: '툴팁 옵션' },
          { name: 'onChange', type: '(value) => void', description: '값 변경 콜백' },
          { name: 'onChangeComplete', type: '(value) => void', description: '드래그 완료 콜백' },
        ]}
      />
    </DocPage>
  );
}
