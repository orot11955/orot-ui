import { useState } from 'react';
import { Pagination } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function PaginationPage() {
  const [current, setCurrent] = useState(1);

  return (
    <DocPage title="Pagination" description="긴 목록을 여러 페이지로 나눕니다.">
      <Example
        title="기본"
        code={`<Pagination total={200} defaultCurrent={1} />`}
      >
        <Pagination total={200} defaultCurrent={1} />
      </Example>

      <Example
        title="총 개수 표시"
        description="showTotal로 전체 항목 수를 표시합니다."
        code={`<Pagination
  total={200}
  showTotal={(total, [start, end]) => \`\${start}–\${end} of \${total}\`}
/>`}
      >
        <Pagination
          total={200}
          showTotal={(total, range) => `${range[0]}–${range[1]} of ${total}`}
          defaultCurrent={1}
        />
      </Example>

      <Example
        title="Size changer + Quick jumper"
        code={`<Pagination total={500} showSizeChanger showQuickJumper />`}
      >
        <Pagination total={500} showSizeChanger showQuickJumper defaultCurrent={1} />
      </Example>

      <Example
        title="Simple"
        code={`<Pagination total={100} simple />`}
      >
        <Pagination total={100} simple defaultCurrent={1} />
      </Example>

      <Example
        title="Controlled"
        code={`const [current, setCurrent] = useState(1);
<Pagination total={100} current={current} onChange={setCurrent} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--orot-color-text-secondary)' }}>
            Current page: {current}
          </div>
          <Pagination total={100} current={current} onChange={(p) => setCurrent(p)} />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'total', type: 'number', description: '전체 항목 수' },
          { name: 'current', type: 'number', description: '현재 페이지 (controlled)' },
          { name: 'defaultCurrent', type: 'number', default: '1', description: '초기 페이지' },
          { name: 'pageSize', type: 'number', description: '페이지당 항목 수 (controlled)' },
          { name: 'defaultPageSize', type: 'number', default: '10', description: '초기 페이지 크기' },
          { name: 'showSizeChanger', type: 'boolean', default: 'false', description: '페이지 크기 변경기 표시' },
          { name: 'showQuickJumper', type: 'boolean', default: 'false', description: '빠른 이동 입력 표시' },
          { name: 'showTotal', type: '(total, range) => ReactNode', description: '전체 개수 렌더 함수' },
          { name: 'simple', type: 'boolean', default: 'false', description: '단순 모드' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화' },
          { name: 'onChange', type: '(page, pageSize) => void', description: '페이지 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
