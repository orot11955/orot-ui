import { Breadcrumb } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function BreadcrumbPage() {
  return (
    <DocPage title="Breadcrumb" description="현재 페이지의 위치를 계층적으로 나타냅니다.">
      <Example
        title="기본"
        code={`<Breadcrumb items={[
  { title: 'Home' },
  { title: 'Components' },
  { title: 'Breadcrumb' },
]} />`}
      >
        <Breadcrumb items={[
          { title: 'Home' },
          { title: 'Components' },
          { title: 'Breadcrumb' },
        ]} />
      </Example>

      <Example
        title="링크"
        description="href를 지정하면 마지막 항목 외에는 링크로 렌더링됩니다."
        code={`<Breadcrumb items={[
  { title: 'Home', href: '/' },
  { title: 'Components', href: '/components' },
  { title: 'Breadcrumb' },
]} />`}
      >
        <Breadcrumb items={[
          { title: 'Home', href: '#' },
          { title: 'Components', href: '#' },
          { title: 'Breadcrumb' },
        ]} />
      </Example>

      <Example
        title="커스텀 구분자"
        code={`<Breadcrumb separator=">" items={[...]} />`}
      >
        <Breadcrumb
          separator=">"
          items={[
            { title: 'Home', href: '#' },
            { title: 'List', href: '#' },
            { title: 'Detail' },
          ]}
        />
      </Example>

      <Example
        title="Item Menu"
        description="각 item에 menu를 연결해 하위 액션을 드롭다운으로 노출할 수 있습니다."
        code={`<Breadcrumb items={[
  { title: 'Docs', href: '#' },
  { title: 'Components', menu: { items: [{ key: 'all', label: 'All components' }] } },
  { title: 'Breadcrumb' },
]} />`}
      >
        <Breadcrumb
          items={[
            { title: 'Docs', href: '#' },
            {
              title: 'Components',
              menu: {
                items: [
                  { key: 'all', label: 'All components' },
                  { key: 'layout', label: 'Layout primitives' },
                ],
              },
            },
            { title: 'Breadcrumb' },
          ]}
        />
      </Example>

      <PropsTable
        rows={[
          { name: 'items', type: 'BreadcrumbItem[]', description: '브레드크럼 항목 배열. title 필수' },
          { name: 'separator', type: 'ReactNode', default: "'/'", description: '구분자' },
          { name: 'menu', type: '{ items: DropdownItemType[] }', description: 'item별 드롭다운 메뉴' },
        ]}
      />
    </DocPage>
  );
}
