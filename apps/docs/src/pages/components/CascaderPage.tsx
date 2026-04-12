import { Cascader } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const options = [
  {
    value: 'korea',
    label: '대한민국',
    children: [
      {
        value: 'seoul',
        label: '서울',
        children: [
          { value: 'gangnam', label: '강남구' },
          { value: 'mapo', label: '마포구' },
        ],
      },
      {
        value: 'busan',
        label: '부산',
        children: [
          { value: 'haeundae', label: '해운대구' },
        ],
      },
    ],
  },
  {
    value: 'japan',
    label: '일본',
    children: [
      { value: 'tokyo', label: '도쿄' },
      { value: 'osaka', label: '오사카' },
    ],
  },
];

export default function CascaderPage() {
  return (
    <DocPage title="Cascader" description="계층적 데이터에서 선택하는 다단 드롭다운입니다.">
      <Example
        title="기본"
        code={`<Cascader options={options} placeholder="지역 선택..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Cascader options={options} placeholder="지역 선택..." />
        </div>
      </Example>

      <Example
        title="Hover Expand"
        code={`<Cascader options={options} expandTrigger="hover" placeholder="Hover to expand..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Cascader options={options} expandTrigger="hover" placeholder="Hover to expand..." />
        </div>
      </Example>

      <Example
        title="Allow Clear"
        code={`<Cascader options={options} allowClear defaultValue={['korea', 'seoul', 'gangnam']} />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Cascader options={options} allowClear defaultValue={['korea', 'seoul', 'gangnam']} />
        </div>
      </Example>

      <Example
        title="Show Search"
        code={`<Cascader options={options} showSearch placeholder="검색..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Cascader options={options} showSearch placeholder="검색..." />
        </div>
      </Example>

      <Example
        title="Change on Select"
        code={`<Cascader options={options} changeOnSelect placeholder="중간 단계도 선택 가능" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <Cascader options={options} changeOnSelect placeholder="중간 단계도 선택 가능" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'options', type: 'CascaderOption[]', description: '계층 옵션 목록' },
          { name: 'value', type: '(string | number)[]', description: '제어 값' },
          { name: 'defaultValue', type: '(string | number)[]', description: '초기 값' },
          { name: 'placeholder', type: 'string', description: '플레이스홀더' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'allowClear', type: 'boolean', description: '지우기 버튼 표시' },
          { name: 'showSearch', type: 'boolean', description: '검색 입력 활성화' },
          { name: 'expandTrigger', type: "'click' | 'hover'", default: "'click'", description: '하위 메뉴 펼침 트리거' },
          { name: 'changeOnSelect', type: 'boolean', description: '중간 단계 선택 허용' },
          { name: 'displayRender', type: '(labels) => ReactNode', description: '선택 표시 커스터마이징' },
          { name: 'onChange', type: '(value, selectedOptions) => void', description: '선택 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
