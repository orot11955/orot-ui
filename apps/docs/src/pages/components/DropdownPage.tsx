import { Trash2, Edit, Copy } from 'lucide-react';
import { Dropdown, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const items = [
  { key: 'edit', label: 'Edit', icon: <Edit size={14} /> },
  { key: 'copy', label: 'Copy', icon: <Copy size={14} /> },
  { key: 'divider-1', type: 'divider' as const },
  { key: 'delete', label: 'Delete', icon: <Trash2 size={14} />, danger: true },
];

export default function DropdownPage() {
  return (
    <DocPage title="Dropdown" description="버튼이나 링크에 드롭다운 메뉴를 연결합니다.">
      <Example
        title="Hover 트리거 (기본)"
        code={`<Dropdown menu={{ items }}>
  <Button variant="outlined">Hover me ▾</Button>
</Dropdown>`}
      >
        <Dropdown menu={{ items }}>
          <Button variant="outlined">Hover me ▾</Button>
        </Dropdown>
      </Example>

      <Example
        title="Click 트리거"
        code={`<Dropdown menu={{ items }} trigger="click" arrow>
  <Button>Click me ▾</Button>
</Dropdown>`}
      >
        <Dropdown menu={{ items }} trigger="click" arrow>
          <Button>Click me ▾</Button>
        </Dropdown>
      </Example>

      <Example
        title="Placement"
        description="placement prop으로 드롭다운 방향을 지정합니다."
        code={`<Dropdown menu={{ items }} placement="bottomRight">
  <Button variant="outlined">bottomRight ▾</Button>
</Dropdown>`}
      >
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button variant="outlined">bottomRight ▾</Button>
        </Dropdown>
      </Example>

      <Example
        title="Context Menu + popupRender"
        description="contextMenu 트리거와 popupRender로 문맥 메뉴를 감쌀 수 있습니다."
        code={`<Dropdown
  menu={{ items }}
  trigger="contextMenu"
  popupRender={(menu) => <div>{menu}<div style={{ padding: 8 }}>Quick note</div></div>}
>
  <div>Right click me</div>
</Dropdown>`}
      >
        <Dropdown
          menu={{ items }}
          trigger="contextMenu"
          popupRender={(menu) => (
            <div style={{ borderRadius: 8, overflow: 'hidden' }}>
              {menu}
              <div style={{ padding: '8px 12px', borderTop: '1px solid var(--orot-color-border)', fontSize: 12, color: 'var(--orot-color-text-secondary)' }}>
                Quick note
              </div>
            </div>
          )}
        >
          <div style={{ padding: '16px 18px', border: '1px dashed var(--orot-color-border)', borderRadius: 6, color: 'var(--orot-color-text-secondary)' }}>
            Right click me
          </div>
        </Dropdown>
      </Example>

      <Example
        title="Disabled"
        code={`<Dropdown menu={{ items }} disabled>
  <Button disabled>Disabled</Button>
</Dropdown>`}
      >
        <Dropdown menu={{ items }} disabled>
          <Button disabled>Disabled</Button>
        </Dropdown>
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'DropdownItemType[]', description: '드롭다운 메뉴 아이템 배열' },
          { name: 'menu', type: '{ items: DropdownItemType[] }', description: '권장 메뉴 설정 객체' },
          { name: 'trigger', type: "'hover' | 'click' | 'contextMenu' | DropdownTrigger[]", default: "'hover'", description: '트리거 방식' },
          { name: 'placement', type: 'DropdownPlacement', default: "'bottomLeft'", description: '드롭다운 위치' },
          { name: 'open', type: 'boolean', description: '표시 여부 (controlled)' },
          { name: 'arrow', type: 'boolean', default: 'false', description: '팝업 화살표 표시' },
          { name: 'disabled', type: 'boolean', default: 'false', description: '비활성화' },
          { name: 'popupRender', type: '(menu: ReactNode) => ReactNode', description: '팝업 래핑/커스터마이즈' },
          { name: 'destroyOnHidden', type: 'boolean', default: 'true', description: '닫힐 때 DOM 제거' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: '열기/닫기 콜백' },
          { name: 'children', type: 'ReactNode', description: '트리거 요소' },
        ]}
      />
    </DocPage>
  );
}
