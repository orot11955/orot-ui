import { TreeSelect } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const treeData = [
  {
    value: 'frontend',
    title: 'Frontend',
    children: [
      { value: 'react', title: 'React' },
      { value: 'vue', title: 'Vue' },
      { value: 'svelte', title: 'Svelte' },
    ],
  },
  {
    value: 'backend',
    title: 'Backend',
    children: [
      { value: 'node', title: 'Node.js' },
      { value: 'python', title: 'Python' },
      { value: 'go', title: 'Go' },
    ],
  },
];

export default function TreeSelectPage() {
  return (
    <DocPage title="TreeSelect" description="트리 구조 데이터를 드롭다운으로 선택합니다.">
      <Example
        title="기본"
        code={`<TreeSelect treeData={treeData} placeholder="기술 스택 선택..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <TreeSelect treeData={treeData} placeholder="기술 스택 선택..." />
        </div>
      </Example>

      <Example
        title="Multiple"
        code={`<TreeSelect treeData={treeData} multiple placeholder="다중 선택..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <TreeSelect treeData={treeData} multiple placeholder="다중 선택..." />
        </div>
      </Example>

      <Example
        title="Tree Checkable"
        code={`<TreeSelect treeData={treeData} treeCheckable placeholder="체크박스 선택..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <TreeSelect treeData={treeData} treeCheckable placeholder="체크박스 선택..." />
        </div>
      </Example>

      <Example
        title="Show Search"
        code={`<TreeSelect treeData={treeData} showSearch placeholder="검색..." />`}
      >
        <div style={{ maxWidth: 300 }}>
          <TreeSelect treeData={treeData} showSearch placeholder="검색..." />
        </div>
      </Example>

      <Example
        title="Default Expand All"
        code={`<TreeSelect treeData={treeData} treeDefaultExpandAll placeholder="기본 펼침" />`}
      >
        <div style={{ maxWidth: 300 }}>
          <TreeSelect treeData={treeData} treeDefaultExpandAll placeholder="기본 펼침" />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'treeData', type: 'TreeSelectDataItem[]', description: '트리 데이터' },
          { name: 'value', type: 'string | number | (string|number)[]', description: '제어 값' },
          { name: 'multiple', type: 'boolean', description: '다중 선택 모드' },
          { name: 'treeCheckable', type: 'boolean', description: '체크박스 모드' },
          { name: 'showSearch', type: 'boolean', description: '검색 입력 표시' },
          { name: 'allowClear', type: 'boolean', description: '지우기 버튼 표시' },
          { name: 'treeDefaultExpandAll', type: 'boolean', description: '기본 전체 펼침' },
          { name: 'placeholder', type: 'string', description: '플레이스홀더' },
          { name: 'disabled', type: 'boolean', description: '비활성화' },
          { name: 'status', type: "'error' | 'warning'", description: '유효성 상태' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '크기' },
          { name: 'onChange', type: '(value) => void', description: '변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
