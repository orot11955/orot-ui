import { Tree } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const treeData = [
  {
    key: 'frontend',
    title: 'Frontend',
    children: [
      { key: 'react', title: 'React' },
      { key: 'vue', title: 'Vue' },
      { key: 'svelte', title: 'Svelte' },
    ],
  },
  {
    key: 'backend',
    title: 'Backend',
    children: [
      { key: 'node', title: 'Node.js' },
      { key: 'python', title: 'Python' },
      {
        key: 'go',
        title: 'Go',
        children: [
          { key: 'gin', title: 'Gin' },
          { key: 'fiber', title: 'Fiber' },
        ],
      },
    ],
  },
];

export default function TreePage() {
  return (
    <DocPage title="Tree" description="계층적 트리 구조 데이터를 표시합니다.">
      <Example
        title="기본"
        code={`<Tree treeData={treeData} />`}
      >
        <Tree treeData={treeData} />
      </Example>

      <Example
        title="Default Expand All"
        code={`<Tree treeData={treeData} defaultExpandAll />`}
      >
        <Tree treeData={treeData} defaultExpandAll />
      </Example>

      <Example
        title="Checkable"
        code={`<Tree treeData={treeData} checkable defaultExpandAll />`}
      >
        <Tree treeData={treeData} checkable defaultExpandAll />
      </Example>

      <Example
        title="Show Line"
        code={`<Tree treeData={treeData} showLine defaultExpandAll />`}
      >
        <Tree treeData={treeData} showLine defaultExpandAll />
      </Example>

      <Example
        title="Disabled"
        code={`<Tree treeData={treeData} disabled />`}
      >
        <Tree treeData={treeData} disabled />
      </Example>

      <PropsTable
        rows={[
          { name: 'treeData', type: 'TreeDataItem[]', description: '트리 데이터' },
          { name: 'checkable', type: 'boolean', default: 'false', description: '체크박스 모드' },
          { name: 'selectable', type: 'boolean', default: 'true', description: '노드 선택 가능' },
          { name: 'defaultExpandAll', type: 'boolean', default: 'false', description: '초기 전체 펼침' },
          { name: 'defaultExpandedKeys', type: '(string|number)[]', description: '초기 펼친 키 목록' },
          { name: 'expandedKeys', type: '(string|number)[]', description: '펼친 키 목록 (controlled)' },
          { name: 'selectedKeys', type: '(string|number)[]', description: '선택된 키 목록 (controlled)' },
          { name: 'checkedKeys', type: '(string|number)[]', description: '체크된 키 목록 (controlled)' },
          { name: 'showLine', type: 'boolean', default: 'false', description: '연결선 표시' },
          { name: 'showIcon', type: 'boolean', default: 'false', description: '아이콘 표시' },
          { name: 'blockNode', type: 'boolean', default: 'false', description: '노드 전체 너비' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '전체 비활성화' },
          { name: 'onExpand', type: '(keys) => void', description: '펼침 변경 콜백' },
          { name: 'onSelect', type: '(keys, info) => void', description: '선택 변경 콜백' },
          { name: 'onCheck', type: '(keys, info) => void', description: '체크 변경 콜백' },
        ]}
      />
    </DocPage>
  );
}
