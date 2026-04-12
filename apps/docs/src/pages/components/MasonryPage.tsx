import { Masonry } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const HEIGHTS = [120, 80, 160, 100, 140, 90, 110, 150, 70, 130, 95, 175];
const COLORS = [
  '#e8f4fd', '#fde8e8', '#e8fde8', '#fdf8e8',
  '#f0e8fd', '#e8fdf4', '#fde8f8', '#f4fde8',
  '#e8f0fd', '#fde8ec', '#e8fdfa', '#fdf4e8',
];

const Block = ({ index }: { index: number }) => (
  <div style={{
    height: HEIGHTS[index % HEIGHTS.length],
    background: COLORS[index % COLORS.length],
    border: '1px solid var(--orot-color-border)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: 'var(--orot-color-text-muted)',
  }}>
    Item {index + 1}
  </div>
);

export default function MasonryPage() {
  return (
    <DocPage
      title="Masonry"
      description="높이가 다른 카드를 폭포수처럼 열 단위로 배치합니다. 이미지 갤러리, 핀보드 레이아웃에 적합합니다."
    >
      <Example
        title="기본 (3열)"
        code={`
<Masonry columns={3} gap={16}>
  {items.map((_, i) => <Block key={i} />)}
</Masonry>
        `}
      >
        <Masonry columns={3} gap={16}>
          {HEIGHTS.map((_, i) => <Block key={i} index={i} />)}
        </Masonry>
      </Example>

      <Example
        title="열 수 변경"
        description="columns prop으로 열 개수를 고정합니다."
        code={`
<Masonry columns={2} gap={12}>
  {items.map((_, i) => <Block key={i} />)}
</Masonry>
        `}
      >
        <Masonry columns={2} gap={12}>
          {HEIGHTS.slice(0, 6).map((_, i) => <Block key={i} index={i} />)}
        </Masonry>
      </Example>

      <Example
        title="반응형 열"
        description="columns를 객체로 지정하면 뷰포트 너비에 따라 열 수가 바뀝니다."
        code={`
<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={16}>
  {items.map((_, i) => <Block key={i} />)}
</Masonry>
        `}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={16}>
          {HEIGHTS.map((_, i) => <Block key={i} index={i} />)}
        </Masonry>
      </Example>

      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', description: '배치할 아이템들' },
          { name: 'columns', type: 'number | { xs? sm? md? lg? xl? }', default: '3', description: '열 개수. 객체로 지정하면 반응형 적용' },
          { name: 'gap', type: 'number', default: '16', description: '아이템 간격 (px)' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
