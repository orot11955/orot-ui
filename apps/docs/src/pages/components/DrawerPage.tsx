import { useState } from 'react';
import { Drawer, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function DrawerPage() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'right' | 'left' | 'top' | 'bottom'>('right');

  return (
    <DocPage title="Drawer" description="화면 가장자리에서 슬라이드되는 패널입니다.">
      <Example
        title="기본"
        code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>
<Drawer title="Basic Drawer" open={open} onClose={() => setOpen(false)}>
  <p>Drawer content goes here.</p>
</Drawer>`}
      >
        <Button onClick={() => { setPlacement('right'); setOpen(true); }}>Open Right</Button>
        <Drawer title="Basic Drawer" open={open && placement === 'right'} onClose={() => setOpen(false)}>
          <p>This is the drawer content.</p>
          <p>You can put any content here.</p>
        </Drawer>
      </Example>

      <Example
        title="Placement"
        code={`<Drawer placement="left" ...>...</Drawer>
<Drawer placement="top" ...>...</Drawer>
<Drawer placement="bottom" ...>...</Drawer>`}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {(['left', 'top', 'bottom'] as const).map(p => (
            <Button key={p} variant="outlined" onClick={() => { setPlacement(p); setOpen(true); }}>
              {p}
            </Button>
          ))}
        </div>
        <Drawer
          title={`${placement} Drawer`}
          placement={placement}
          open={open && placement !== 'right'}
          onClose={() => setOpen(false)}
        >
          <p>Placement: {placement}</p>
        </Drawer>
      </Example>

      <Example
        title="No Mask"
        code={`<Drawer mask={false} ...>...</Drawer>`}
      >
        <Button onClick={() => { setPlacement('right'); setOpen(true); }}>
          Open (no mask)
        </Button>
        <Drawer
          title="No Mask"
          mask={false}
          open={open && placement === 'right'}
          onClose={() => setOpen(false)}
        >
          <p>Drawer without backdrop mask.</p>
        </Drawer>
      </Example>

      <PropsTable
        rows={[
          { name: 'open', type: 'boolean', description: '표시 여부 (필수)' },
          { name: 'title', type: 'ReactNode', description: '제목' },
          { name: 'placement', type: "'right' | 'left' | 'top' | 'bottom'", default: "'right'", description: '슬라이드 방향' },
          { name: 'width', type: 'number | string', default: '378', description: '너비 (좌/우 배치 시)' },
          { name: 'height', type: 'number | string', default: '378', description: '높이 (상/하 배치 시)' },
          { name: 'closable', type: 'boolean', default: 'true', description: '닫기 버튼 표시' },
          { name: 'mask', type: 'boolean', default: 'true', description: '배경 마스크 표시' },
          { name: 'maskClosable', type: 'boolean', default: 'true', description: '마스크 클릭 시 닫기' },
          { name: 'keyboard', type: 'boolean', default: 'true', description: 'ESC 키로 닫기' },
          { name: 'footer', type: 'ReactNode', description: '푸터 영역' },
          { name: 'extra', type: 'ReactNode', description: '헤더 추가 영역' },
          { name: 'destroyOnHidden', type: 'boolean', default: 'false', description: '닫힐 때 DOM 제거' },
          { name: 'onClose', type: '() => void', description: '닫기 콜백' },
          { name: 'afterOpenChange', type: '(open: boolean) => void', description: '열기/닫기 완료 콜백' },
        ]}
      />
    </DocPage>
  );
}
