import { Anchor } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const BASIC_ITEMS = [
  { key: 'section-1', href: '#section-1', title: 'Section 1' },
  { key: 'section-2', href: '#section-2', title: 'Section 2' },
  { key: 'section-3', href: '#section-3', title: 'Section 3' },
];

const NESTED_ITEMS = [
  {
    key: 'intro',
    href: '#intro',
    title: 'Introduction',
    children: [
      { key: 'intro-1', href: '#intro-1', title: 'Background' },
      { key: 'intro-2', href: '#intro-2', title: 'Motivation' },
    ],
  },
  {
    key: 'usage',
    href: '#usage',
    title: 'Usage',
    children: [
      { key: 'usage-1', href: '#usage-1', title: 'Basic' },
      { key: 'usage-2', href: '#usage-2', title: 'Advanced' },
    ],
  },
];

export default function AnchorPage() {
  return (
    <DocPage
      title="Anchor"
      description="페이지 내 섹션으로 이동하는 앵커 네비게이션. affix 모드에서는 sticky로 붙어 스크롤을 따라다닙니다."
    >
      <Example
        title="기본"
        description="affix={false}로 인라인 배치합니다."
        code={`
const items = [
  { key: 'section-1', href: '#section-1', title: 'Section 1' },
  { key: 'section-2', href: '#section-2', title: 'Section 2' },
  { key: 'section-3', href: '#section-3', title: 'Section 3' },
];

<Anchor affix={false} items={items} />
        `}
      >
        <Anchor affix={false} items={BASIC_ITEMS} />
      </Example>

      <Example
        title="중첩 구조"
        description="children 배열로 계층형 목차를 구성합니다."
        code={`
const items = [
  {
    key: 'intro',
    href: '#intro',
    title: 'Introduction',
    children: [
      { key: 'intro-1', href: '#intro-1', title: 'Background' },
      { key: 'intro-2', href: '#intro-2', title: 'Motivation' },
    ],
  },
  {
    key: 'usage',
    href: '#usage',
    title: 'Usage',
    children: [
      { key: 'usage-1', href: '#usage-1', title: 'Basic' },
      { key: 'usage-2', href: '#usage-2', title: 'Advanced' },
    ],
  },
];

<Anchor affix={false} items={items} />
        `}
      >
        <Anchor affix={false} items={NESTED_ITEMS} />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'AnchorItem[]', description: '앵커 항목 배열. key, href, title 필수' },
          { name: 'affix', type: 'boolean', default: 'true', description: 'sticky 고정 여부' },
          { name: 'offsetTop', type: 'number', default: '0', description: 'affix 시 상단 오프셋 (px)' },
          { name: 'bounds', type: 'number', default: '5', description: '활성 앵커 판정 범위 (px)' },
          { name: 'targetOffset', type: 'number', description: '스크롤 목표 보정값 (px). 미지정 시 offsetTop + bounds 사용' },
          { name: 'onChange', type: '(currentKey: string) => void', description: '활성 앵커 변경 콜백' },
          { name: 'getCurrentAnchor', type: '() => string', description: '활성 앵커 key를 직접 반환하는 함수. 지정 시 스크롤 감지 대신 이 값 사용' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />

      <PropsTable
        title="AnchorItem"
        rows={[
          { name: 'key', type: 'string', description: '항목 고유 식별자 (활성 판정에 사용)' },
          { name: 'href', type: 'string', description: '이동 대상 URL 또는 #id' },
          { name: 'title', type: 'ReactNode', description: '표시 텍스트 또는 노드' },
          { name: 'children', type: 'AnchorItem[]', description: '하위 항목 배열' },
        ]}
      />
    </DocPage>
  );
}
