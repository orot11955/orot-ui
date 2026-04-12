import { QRCode } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function QRCodePage() {
  return (
    <DocPage title="QRCode" description="URL 또는 텍스트를 QR 코드로 표시합니다.">
      <Example
        title="기본"
        code={`<QRCode value="https://example.com" />`}
      >
        <QRCode value="https://example.com" />
      </Example>

      <Example
        title="크기 및 색상"
        code={`<QRCode value="https://example.com" size={200} color="#1677ff" />`}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <QRCode value="https://example.com" size={120} />
          <QRCode value="https://example.com" size={160} color="#1677ff" />
          <QRCode value="https://example.com" size={200} color="#722ed1" />
        </div>
      </Example>

      <Example
        title="No Border"
        code={`<QRCode value="https://example.com" bordered={false} />`}
      >
        <QRCode value="https://example.com" bordered={false} />
      </Example>

      <Example
        title="Status"
        code={`<QRCode value="https://example.com" status="loading" />
<QRCode value="https://example.com" status="expired" onRefresh={() => alert('refresh')} />
<QRCode value="https://example.com" status="scanned" />`}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--orot-color-text-muted)' }}>loading</div>
            <QRCode value="https://example.com" status="loading" />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--orot-color-text-muted)' }}>expired</div>
            <QRCode value="https://example.com" status="expired" onRefresh={() => alert('Refreshed!')} />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--orot-color-text-muted)' }}>scanned</div>
            <QRCode value="https://example.com" status="scanned" />
          </div>
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'value', type: 'string', description: 'QR 코드로 인코딩할 값 (필수)' },
          { name: 'size', type: 'number', default: '160', description: 'QR 코드 크기 (px)' },
          { name: 'color', type: 'string', default: "'#000000'", description: 'QR 코드 색상' },
          { name: 'bgColor', type: 'string', default: "'#ffffff'", description: '배경 색상' },
          { name: 'bordered', type: 'boolean', default: 'true', description: '테두리 표시' },
          { name: 'status', type: "'active' | 'loading' | 'expired' | 'scanned'", default: "'active'", description: '상태' },
          { name: 'icon', type: 'string', description: '중앙 아이콘 이미지 URL' },
          { name: 'iconSize', type: 'number', description: '아이콘 크기 (기본: size * 0.2)' },
          { name: 'onRefresh', type: '() => void', description: '만료 시 새로고침 콜백' },
        ]}
      />
    </DocPage>
  );
}
