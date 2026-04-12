import { Edit, Share, Trash2 } from 'lucide-react';
import { Card, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function CardPage() {
  return (
    <DocPage title="Card" description="정보를 카드 형태로 구조화합니다.">
      <Example
        title="기본"
        code={`<Card title="Card Title" extra={<Button variant="link" size="sm">More</Button>}>
  <p>Card content goes here.</p>
</Card>`}
      >
        <div style={{ maxWidth: 400 }}>
          <Card
            title="Card Title"
            extra={<Button variant="link" size="sm">More</Button>}
          >
            <p>Card content goes here. You can put any content inside a card.</p>
          </Card>
        </div>
      </Example>

      <Example
        title="Actions"
        code={`<Card
  title="Card with Actions"
  actions={[<Edit size={16} />, <Share size={16} />, <Trash2 size={16} />]}
>
  Content
</Card>`}
      >
        <div style={{ maxWidth: 400 }}>
          <Card
            title="Card with Actions"
            actions={[
              <Edit size={16} />,
              <Share size={16} />,
              <Trash2 size={16} />,
            ]}
          >
            Card with action buttons at the bottom.
          </Card>
        </div>
      </Example>

      <Example
        title="Loading / Hoverable"
        code={`<Card title="Loading" loading />
<Card title="Hoverable" hoverable>Hover me</Card>`}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <Card title="Loading" loading />
          </div>
          <div style={{ width: 200 }}>
            <Card title="Hoverable" hoverable>Hover me for shadow</Card>
          </div>
        </div>
      </Example>

      <Example
        title="No border"
        code={`<Card title="No Border" bordered={false}>Content</Card>`}
      >
        <div style={{ background: 'var(--orot-color-bg-secondary)', padding: 16, borderRadius: 4 }}>
          <Card title="No Border" bordered={false}>
            Card without border, useful on colored backgrounds.
          </Card>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'title', type: 'ReactNode', description: '카드 제목' },
          { name: 'extra', type: 'ReactNode', description: '헤더 오른쪽 추가 요소' },
          { name: 'bordered', type: 'boolean', default: 'true', description: '테두리 표시' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '크기 (패딩)' },
          { name: 'actions', type: 'ReactNode[]', description: '하단 액션 버튼들' },
          { name: 'loading', type: 'boolean', default: 'false', description: '로딩 스켈레톤 표시' },
          { name: 'hoverable', type: 'boolean', default: 'false', description: '호버 시 그림자' },
        ]}
      />
    </DocPage>
  );
}
