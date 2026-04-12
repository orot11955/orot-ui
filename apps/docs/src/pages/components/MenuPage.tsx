import { useState } from 'react';
import { Home, Settings, User, FileText } from 'lucide-react';
import { Menu } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const items = [
  { key: '1', label: 'Home', icon: <Home size={14} /> },
  { key: '2', label: 'Documents', icon: <FileText size={14} />, children: [
    { key: '2-1', label: 'Recent' },
    { key: '2-2', label: 'Starred' },
    { key: 'divider-1', type: 'divider' as const },
    { key: '2-3', label: 'All Files' },
  ]},
  { key: '3', label: 'Profile', icon: <User size={14} /> },
  { key: '4', label: 'Settings', icon: <Settings size={14} />, disabled: true },
];

export default function MenuPage() {
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [lastClick, setLastClick] = useState('1');
  const [multiSelectedKeys, setMultiSelectedKeys] = useState<string[]>(['1']);

  return (
    <DocPage title="Menu" description="사이드바나 헤더에서 내비게이션 메뉴로 사용합니다.">
      <Example
        title="Vertical (기본)"
        description="수직 메뉴. 서브메뉴를 클릭해 열고 닫을 수 있고, 클릭 결과에서 keyPath를 확인할 수 있습니다."
        code={`<Menu items={items} selectedKeys={['1']} style={{ width: 200 }} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Menu
            items={items}
            selectedKeys={selectedKeys}
            defaultOpenKeys={['2']}
            onClick={({ key, keyPath }) => {
              setSelectedKeys([key]);
              setLastClick(keyPath.join(' > '));
            }}
            style={{ width: 200, border: '1px solid var(--orot-color-border)', borderRadius: 4 }}
          />
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-secondary)' }}>
            Last keyPath: {lastClick}
          </div>
        </div>
      </Example>

      <Example
        title="Horizontal"
        description="수평 메뉴. 헤더 내비게이션에 적합합니다."
        code={`<Menu items={items.slice(0,3)} mode="horizontal" selectedKeys={['1']} />`}
      >
        <Menu
          items={items.slice(0, 3)}
          mode="horizontal"
          selectedKeys={selectedKeys}
          onClick={({ key }) => setSelectedKeys([key])}
        />
      </Example>

      <Example
        title="Inline (Collapsed)"
        description="inlineCollapsed로 아이콘만 남기고 접을 수 있습니다."
        code={`<Menu items={items} inlineCollapsed style={{ width: 56 }} />`}
      >
        <Menu
          items={items}
          inlineCollapsed
          selectedKeys={selectedKeys}
          style={{ width: 56, border: '1px solid var(--orot-color-border)', borderRadius: 4 }}
        />
      </Example>

      <Example
        title="Multiple + Dark Theme"
        description="selectable/multiple/theme/inlineIndent 조합으로 더 풍부한 앱 메뉴를 구성할 수 있습니다."
        code={`<Menu
  items={items}
  mode="inline"
  theme="dark"
  multiple
  inlineIndent={20}
  selectedKeys={selectedKeys}
  onClick={({ key }) => ...}
/>`}
      >
        <Menu
          items={items}
          mode="inline"
          theme="dark"
          multiple
          inlineIndent={20}
          defaultOpenKeys={['2']}
          selectedKeys={multiSelectedKeys}
          onClick={({ key }) => {
            setMultiSelectedKeys((current) =>
              current.includes(key)
                ? current.filter((item) => item !== key)
                : [...current, key],
            );
          }}
          style={{ width: 220, border: '1px solid var(--orot-color-border)', borderRadius: 4 }}
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'MenuItemType[]', description: '메뉴 아이템 배열' },
          { name: 'mode', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'", description: '메뉴 방향' },
          { name: 'theme', type: "'light' | 'dark'", default: "'light'", description: '메뉴 톤' },
          { name: 'selectedKeys', type: 'string[]', description: '선택된 키 (controlled)' },
          { name: 'defaultSelectedKeys', type: 'string[]', description: '기본 선택 키' },
          { name: 'openKeys', type: 'string[]', description: '열린 서브메뉴 키 (controlled)' },
          { name: 'defaultOpenKeys', type: 'string[]', description: '기본 열린 서브메뉴 키' },
          { name: 'inlineCollapsed', type: 'boolean', default: 'false', description: '접힌 상태 (아이콘만)' },
          { name: 'inlineIndent', type: 'number', default: '16', description: 'inline 모드 들여쓰기 폭' },
          { name: 'selectable', type: 'boolean', default: 'true', description: '선택 상태 관리 여부' },
          { name: 'multiple', type: 'boolean', default: 'false', description: '다중 선택 여부' },
          { name: 'onClick', type: '(info: MenuClickInfo) => void', description: '아이템 클릭 콜백' },
          { name: 'onSelect', type: '(info: MenuClickInfo) => void', description: '선택 이벤트 콜백' },
          { name: 'onDeselect', type: '(info: MenuClickInfo) => void', description: '선택 해제 이벤트 콜백' },
          { name: 'onOpenChange', type: '(keys: string[]) => void', description: '서브메뉴 토글 콜백' },
        ]}
      />
    </DocPage>
  );
}
