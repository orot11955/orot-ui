import { Transfer } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const mockData = Array.from({ length: 10 }, (_, i) => ({
  key: String(i + 1),
  title: `Item ${i + 1}`,
  description: `Description of item ${i + 1}`,
  disabled: i === 3,
}));

export default function TransferPage() {
  return (
    <DocPage title="Transfer" description="두 영역 사이에서 항목을 이동하는 이중 리스트 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<Transfer dataSource={mockData} defaultTargetKeys={['1', '3']} />`}
      >
        <Transfer dataSource={mockData} defaultTargetKeys={['1', '3']} />
      </Example>

      <Example
        title="Show Search"
        code={`<Transfer dataSource={mockData} showSearch defaultTargetKeys={['2']} />`}
      >
        <Transfer dataSource={mockData} showSearch defaultTargetKeys={['2']} />
      </Example>

      <Example
        title="Custom Titles"
        code={`<Transfer
  dataSource={mockData}
  titles={['Source', 'Target']}
  defaultTargetKeys={['1']}
/>`}
      >
        <Transfer
          dataSource={mockData}
          titles={['Source', 'Target']}
          defaultTargetKeys={['1']}
        />
      </Example>

      <Example
        title="Disabled"
        code={`<Transfer dataSource={mockData} disabled defaultTargetKeys={['1', '2']} />`}
      >
        <Transfer dataSource={mockData} disabled defaultTargetKeys={['1', '2']} />
      </Example>

      <PropsTable
        rows={[
          { name: 'dataSource', type: 'TransferItem[]', description: '데이터 소스' },
          { name: 'targetKeys', type: 'string[]', description: '오른쪽(타겟) 키 목록 (제어)' },
          { name: 'defaultTargetKeys', type: 'string[]', description: '초기 타겟 키 목록' },
          { name: 'selectedKeys', type: 'string[]', description: '선택된 키 목록 (제어)' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'showSearch', type: 'boolean', description: '검색 입력 표시' },
          { name: 'showSelectAll', type: 'boolean', default: 'true', description: '전체 선택 체크박스 표시' },
          { name: 'titles', type: '[ReactNode, ReactNode]', description: '패널 제목' },
          { name: 'operations', type: '[ReactNode, ReactNode]', description: '이동 버튼 텍스트' },
          { name: 'render', type: '(item) => ReactNode', description: '항목 렌더 함수' },
          { name: 'filterOption', type: '(inputValue, item) => boolean', description: '필터 함수' },
          { name: 'onChange', type: '(targetKeys, direction, moveKeys) => void', description: '이동 콜백' },
        ]}
      />
    </DocPage>
  );
}
