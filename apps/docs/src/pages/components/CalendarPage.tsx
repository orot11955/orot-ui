import { Calendar } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function CalendarPage() {
  return (
    <DocPage title="Calendar" description="날짜 선택 및 이벤트 표시를 위한 달력 컴포넌트입니다.">
      <Example
        title="기본 (Fullscreen)"
        code={`<Calendar />`}
      >
        <Calendar />
      </Example>

      <Example
        title="Mini (Card) Mode"
        description="fullscreen={false}로 카드형 달력을 표시합니다."
        code={`<Calendar fullscreen={false} />`}
      >
        <div style={{ maxWidth: 320 }}>
          <Calendar fullscreen={false} />
        </div>
      </Example>

      <Example
        title="Year Mode"
        description="mode를 'year'로 설정하면 월 선택 달력을 표시합니다."
        code={`<Calendar mode="year" fullscreen={false} />`}
      >
        <div style={{ maxWidth: 320 }}>
          <Calendar mode="year" fullscreen={false} />
        </div>
      </Example>

      <Example
        title="Date Cell Render"
        description="dateCellRender로 날짜 셀에 커스텀 콘텐츠를 추가합니다."
        code={`<Calendar fullscreen={false} dateCellRender={(date) => {
  if (date.getDate() === 10) return <div style={{ color: 'red', fontSize: 10 }}>Event</div>;
}} />`}
      >
        <div style={{ maxWidth: 320 }}>
          <Calendar
            fullscreen={false}
            dateCellRender={(date) => {
              if (date.getDate() === 10) return <div style={{ color: 'red', fontSize: 10 }}>Event</div>;
              if (date.getDate() === 20) return <div style={{ color: 'green', fontSize: 10 }}>Deadline</div>;
            }}
          />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'Date', description: '선택된 날짜 (controlled)' },
          { name: 'defaultValue', type: 'Date', description: '초기 선택 날짜' },
          { name: 'mode', type: "'month' | 'year'", default: "'month'", description: '달력 모드' },
          { name: 'fullscreen', type: 'boolean', default: 'true', description: '전체 화면 모드' },
          { name: 'disabledDate', type: '(date: Date) => boolean', description: '비활성화 날짜 함수' },
          { name: 'dateCellRender', type: '(date: Date) => ReactNode', description: '날짜 셀 커스텀 렌더러' },
          { name: 'monthCellRender', type: '(date: Date) => ReactNode', description: '월 셀 커스텀 렌더러' },
          { name: 'onSelect', type: '(date, info) => void', description: '날짜 선택 콜백' },
          { name: 'onChange', type: '(date: Date) => void', description: '날짜 변경 콜백' },
          { name: 'onPanelChange', type: '(date, mode) => void', description: '패널 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
