import { InputNumber } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function InputNumberPage() {
  return (
    <DocPage title="InputNumber" description="숫자 입력 컴포넌트. 스핀 버튼으로 값을 증감할 수 있습니다.">
      <Example
        title="기본"
        code={`<InputNumber defaultValue={3} />`}
      >
        <InputNumber defaultValue={3} />
      </Example>

      <Example
        title="Min / Max / Step"
        code={`<InputNumber min={0} max={100} step={5} defaultValue={20} />`}
      >
        <InputNumber min={0} max={100} step={5} defaultValue={20} />
      </Example>

      <Example
        title="Precision"
        code={`<InputNumber precision={2} defaultValue={3.14} />`}
      >
        <InputNumber precision={2} defaultValue={3.14} />
      </Example>

      <Example
        title="Prefix / Addon"
        code={`<InputNumber addonBefore="$" addonAfter="USD" defaultValue={100} />
<InputNumber prefix="₩" defaultValue={50000} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <InputNumber addonBefore="$" addonAfter="USD" defaultValue={100} />
          <InputNumber prefix="₩" defaultValue={50000} />
        </div>
      </Example>

      <Example
        title="Controls 숨기기"
        code={`<InputNumber controls={false} defaultValue={42} />`}
      >
        <InputNumber controls={false} defaultValue={42} />
      </Example>

      <Example
        title="Sizes"
        code={`<InputNumber size="sm" defaultValue={1} />
<InputNumber size="md" defaultValue={1} />
<InputNumber size="lg" defaultValue={1} />`}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <InputNumber size="sm" defaultValue={1} />
          <InputNumber size="md" defaultValue={1} />
          <InputNumber size="lg" defaultValue={1} />
        </div>
      </Example>

      <Example
        title="Status"
        code={`<InputNumber status="error" defaultValue={0} />
<InputNumber status="warning" defaultValue={0} />`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <InputNumber status="error" defaultValue={0} />
          <InputNumber status="warning" defaultValue={0} />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<InputNumber disabled defaultValue={5} />`}
      >
        <InputNumber disabled defaultValue={5} />
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'number', description: '제어 값' },
          { name: 'defaultValue', type: 'number', description: '초기 값' },
          { name: 'min', type: 'number', description: '최솟값' },
          { name: 'max', type: 'number', description: '최댓값' },
          { name: 'step', type: 'number', default: '1', description: '증감 단위' },
          { name: 'precision', type: 'number', description: '소수점 자릿수' },
          { name: 'controls', type: 'boolean', default: 'true', description: '스핀 버튼 표시 여부' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'prefix', type: 'ReactNode', description: '앞 요소' },
          { name: 'addonBefore', type: 'ReactNode', description: '앞 어드온' },
          { name: 'addonAfter', type: 'ReactNode', description: '뒤 어드온' },
          { name: 'formatter', type: '(value) => string', description: '표시 형식 변환 함수' },
          { name: 'parser', type: '(str) => number', description: '입력 문자열 파싱 함수' },
          { name: 'onChange', type: '(value: number | null) => void', description: '값 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
