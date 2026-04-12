import { ColorPicker } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const presets = [
  {
    label: 'Recommended',
    colors: ['#F5222D', '#FA8C16', '#FADB14', '#52C41A', '#1677FF', '#722ED1', '#000000'],
  },
];

export default function ColorPickerPage() {
  return (
    <DocPage title="ColorPicker" description="색상을 선택하는 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<ColorPicker defaultValue="#1677ff" />`}
      >
        <ColorPicker defaultValue="#1677ff" />
      </Example>

      <Example
        title="Show Text"
        code={`<ColorPicker defaultValue="#52c41a" showText />`}
      >
        <ColorPicker defaultValue="#52c41a" showText />
      </Example>

      <Example
        title="Allow Clear"
        code={`<ColorPicker defaultValue="#722ed1" allowClear showText />`}
      >
        <ColorPicker defaultValue="#722ed1" allowClear showText />
      </Example>

      <Example
        title="Presets"
        code={`<ColorPicker defaultValue="#1677ff" presets={presets} showText />`}
      >
        <ColorPicker defaultValue="#1677ff" presets={presets} showText />
      </Example>

      <Example
        title="Sizes"
        code={`<ColorPicker size="sm" defaultValue="#f5222d" />
<ColorPicker size="md" defaultValue="#fa8c16" />
<ColorPicker size="lg" defaultValue="#52c41a" />`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ColorPicker size="sm" defaultValue="#f5222d" />
          <ColorPicker size="md" defaultValue="#fa8c16" />
          <ColorPicker size="lg" defaultValue="#52c41a" />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<ColorPicker disabled defaultValue="#1677ff" showText />`}
      >
        <ColorPicker disabled defaultValue="#1677ff" showText />
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'string', description: '제어 색상 값 (hex)' },
          { name: 'defaultValue', type: 'string', description: '초기 색상 값' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'showText', type: 'boolean', description: 'hex 값 텍스트 표시' },
          { name: 'allowClear', type: 'boolean', description: '지우기 버튼 표시' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'presets', type: 'Array<{ label, colors }>',  description: '프리셋 색상 그룹' },
          { name: 'onChange', type: '(color: string) => void', description: '색상 변경 콜백' },
          { name: 'onClear', type: '() => void', description: '지우기 콜백' },
        ]}
      />
    </DocPage>
  );
}
