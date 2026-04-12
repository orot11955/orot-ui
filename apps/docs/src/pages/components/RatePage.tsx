import { useState } from 'react';
import { Rate } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const TOOLTIPS = ['최악', '별로', '보통', '좋음', '최고'];

export default function RatePage() {
  const [value, setValue] = useState(3);

  return (
    <DocPage
      title="Rate"
      description="별점 입력 컴포넌트. 콘텐츠 평가, 만족도 조사, 피드백 수집에 사용합니다."
    >
      <Example
        title="기본"
        code={`<Rate defaultValue={3} />`}
      >
        <Rate defaultValue={3} />
      </Example>

      <Example
        title="반별점 (allowHalf)"
        description="allowHalf를 사용하면 0.5 단위 입력이 가능합니다."
        code={`<Rate allowHalf defaultValue={2.5} />`}
      >
        <Rate allowHalf defaultValue={2.5} />
      </Example>

      <Example
        title="Tooltips"
        description="각 별에 툴팁 텍스트를 지정합니다."
        code={`
const tooltips = ['최악', '별로', '보통', '좋음', '최고'];
<Rate tooltips={tooltips} defaultValue={3} />
        `}
      >
        <Rate tooltips={TOOLTIPS} defaultValue={3} />
      </Example>

      <Example
        title="Count"
        description="count로 별 개수를 변경합니다."
        code={`<Rate count={10} defaultValue={7} />`}
      >
        <Rate count={10} defaultValue={7} />
      </Example>

      <Example
        title="Controlled"
        code={`
const [value, setValue] = useState(3);
<Rate value={value} onChange={setValue} />
<span>선택: {value}점</span>
        `}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Rate value={value} onChange={setValue} />
          <span style={{ fontSize: 13, color: 'var(--orot-color-text-muted)' }}>
            {value}점
          </span>
        </div>
      </Example>

      <Example
        title="Allow Clear"
        description="allowClear를 사용하면 같은 별을 다시 클릭해 선택을 해제할 수 있습니다."
        code={`<Rate allowClear defaultValue={3} />`}
      >
        <Rate allowClear defaultValue={3} />
      </Example>

      <Example
        title="커스텀 문자"
        description="character prop으로 별 대신 다른 텍스트나 이모지를 사용합니다."
        code={`
<Rate character="A" count={5} defaultValue={3} />
<Rate character={(i) => String(i + 1)} count={5} defaultValue={3} />
        `}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Rate character="A" count={5} defaultValue={3} />
          <Rate character={(i: number) => String(i + 1)} count={5} defaultValue={3} />
        </div>
      </Example>

      <Example
        title="Disabled"
        code={`<Rate disabled defaultValue={3} />`}
      >
        <Rate disabled defaultValue={3} />
      </Example>

      <PropsTable
        rows={[
          { name: 'count', type: 'number', default: '5', description: '별 개수' },
          { name: 'value', type: 'number', description: '선택된 별점 (controlled)' },
          { name: 'defaultValue', type: 'number', description: '초기 별점' },
          { name: 'allowHalf', type: 'boolean', default: 'false', description: '0.5 단위 입력 허용' },
          { name: 'allowClear', type: 'boolean', default: 'false', description: '동일 별 재클릭으로 선택 해제' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화' },
          { name: 'tooltips', type: 'string[]', description: '각 별의 툴팁 텍스트 배열' },
          { name: 'character', type: 'ReactNode | ((index: number) => ReactNode)', description: '별 대신 표시할 문자 또는 함수' },
          { name: 'onChange', type: '(value: number) => void', description: '별점 변경 콜백' },
          { name: 'onHoverChange', type: '(value: number) => void', description: '호버 시 별점 변경 콜백' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
