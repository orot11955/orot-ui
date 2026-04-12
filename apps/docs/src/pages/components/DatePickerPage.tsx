import { DatePicker } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function DatePickerPage() {
  return (
    <DocPage title="DatePicker" description="날짜를 선택하는 달력 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<DatePicker />`}
      >
        <DatePicker />
      </Example>

      <Example
        title="Show Today 비활성화"
        code={`<DatePicker showToday={false} />`}
      >
        <DatePicker showToday={false} />
      </Example>

      <Example
        title="Allow Clear"
        code={`<DatePicker allowClear />`}
      >
        <DatePicker allowClear />
      </Example>

      <Example
        title="RangePicker"
        code={`<DatePicker.RangePicker />`}
      >
        <DatePicker.RangePicker />
      </Example>

      <Example
        title="Disabled Date"
        code={`<DatePicker disabledDate={(d) => d < new Date()} />`}
      >
        <DatePicker disabledDate={(d) => d < new Date()} />
      </Example>

      <Example
        title="Sizes"
        code={`<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DatePicker size="sm" />
          <DatePicker size="md" />
          <DatePicker size="lg" />
        </div>
      </Example>

      <Example
        title="Status"
        code={`<DatePicker status="error" />
<DatePicker status="warning" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DatePicker status="error" />
          <DatePicker status="warning" />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<DatePicker disabled />`}
      >
        <DatePicker disabled />
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'Date | null', description: '제어 값' },
          { name: 'defaultValue', type: 'Date | null', description: '초기 값' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'allowClear', type: 'boolean', default: 'true', description: '지우기 버튼 표시' },
          { name: 'showToday', type: 'boolean', default: 'true', description: '오늘 버튼 표시' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'disabledDate', type: '(date: Date) => boolean', description: '선택 불가 날짜 함수' },
          { name: 'onChange', type: '(date, dateString) => void', description: '날짜 변경 콜백' },
          { name: 'onOpenChange', type: '(open) => void', description: '드롭다운 열림 상태 콜백' },
        ]}
      />
    </DocPage>
  );
}
