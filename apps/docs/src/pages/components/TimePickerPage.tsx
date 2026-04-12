import { TimePicker } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function TimePickerPage() {
  return (
    <DocPage title="TimePicker" description="시간을 선택하는 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<TimePicker />`}
      >
        <TimePicker />
      </Example>

      <Example
        title="12시간제"
        code={`<TimePicker use12Hours />`}
      >
        <TimePicker use12Hours />
      </Example>

      <Example
        title="Step 설정"
        code={`<TimePicker minuteStep={15} secondStep={30} />`}
      >
        <TimePicker minuteStep={15} secondStep={30} />
      </Example>

      <Example
        title="초 숨기기"
        code={`<TimePicker showSecond={false} />`}
      >
        <TimePicker showSecond={false} />
      </Example>

      <Example
        title="Sizes"
        code={`<TimePicker size="sm" />
<TimePicker size="md" />
<TimePicker size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TimePicker size="sm" />
          <TimePicker size="md" />
          <TimePicker size="lg" />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<TimePicker disabled />`}
      >
        <TimePicker disabled />
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'Date | null', description: '제어 값' },
          { name: 'defaultValue', type: 'Date | null', description: '초기 값' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'allowClear', type: 'boolean', default: 'true', description: '지우기 버튼 표시' },
          { name: 'use12Hours', type: 'boolean', description: '12시간제 표시' },
          { name: 'hourStep', type: 'number', default: '1', description: '시 스텝' },
          { name: 'minuteStep', type: 'number', default: '1', description: '분 스텝' },
          { name: 'secondStep', type: 'number', default: '1', description: '초 스텝' },
          { name: 'showHour', type: 'boolean', default: 'true', description: '시 컬럼 표시' },
          { name: 'showMinute', type: 'boolean', default: 'true', description: '분 컬럼 표시' },
          { name: 'showSecond', type: 'boolean', default: 'true', description: '초 컬럼 표시' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'onChange', type: '(time, timeString) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
