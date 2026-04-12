import { Watermark } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function WatermarkPage() {
  return (
    <DocPage title="Watermark" description="콘텐츠 위에 워터마크를 표시합니다.">
      <Example
        title="텍스트 워터마크"
        code={`<Watermark content="orot-ui">
  <div style={{ height: 200 }}>Your content here</div>
</Watermark>`}
      >
        <Watermark content="orot-ui">
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orot-color-text-muted)' }}>
            Content area
          </div>
        </Watermark>
      </Example>

      <Example
        title="다중 텍스트"
        code={`<Watermark content={['orot-ui', 'Confidential']}>
  <div style={{ height: 200 }} />
</Watermark>`}
      >
        <Watermark content={['orot-ui', 'Confidential']}>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orot-color-text-muted)' }}>
            Content area
          </div>
        </Watermark>
      </Example>

      <Example
        title="커스텀 스타일"
        code={`<Watermark
  content="Custom"
  font={{ color: 'rgba(0,0,200,0.2)', fontSize: 18 }}
  rotate={-30}
  gap={[80, 80]}
>
  <div style={{ height: 200 }} />
</Watermark>`}
      >
        <Watermark
          content="Custom"
          font={{ color: 'rgba(0,0,200,0.2)', fontSize: 18 }}
          rotate={-30}
          gap={[80, 80]}
        >
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orot-color-text-muted)' }}>
            Content area
          </div>
        </Watermark>
      </Example>

      <PropsTable
        rows={[
          { name: 'content', type: 'string | string[]', description: '워터마크 텍스트' },
          { name: 'image', type: 'string', description: '워터마크 이미지 URL' },
          { name: 'width', type: 'number', default: '120', description: '워터마크 너비' },
          { name: 'height', type: 'number', default: '64', description: '워터마크 높이' },
          { name: 'rotate', type: 'number', default: '-22', description: '회전 각도 (도)' },
          { name: 'gap', type: '[number, number]', default: '[100, 100]', description: '워터마크 간격 [x, y]' },
          { name: 'offset', type: '[number, number]', description: '시작 오프셋 [x, y]' },
          { name: 'font', type: 'WatermarkFont', description: '폰트 설정 (color, size, family, style, weight)' },
          { name: 'zIndex', type: 'number', description: 'z-index 값' },
          { name: 'children', type: 'ReactNode', description: '워터마크가 적용될 콘텐츠' },
        ]}
      />
    </DocPage>
  );
}
