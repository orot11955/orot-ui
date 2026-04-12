import { Image } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

// SVG 플레이스홀더 (외부 네트워크 없이 동작)
function makeSvg(label: string, bg: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280">
    <rect width="400" height="280" fill="${bg}"/>
    <text x="200" y="140" font-family="sans-serif" font-size="20" fill="rgba(0,0,0,0.35)"
      dominant-baseline="middle" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const IMG1 = makeSvg('Image 1', '#dbeafe');
const IMG2 = makeSvg('Image 2', '#dcfce7');
const IMG3 = makeSvg('Image 3', '#fef9c3');
const FALLBACK = makeSvg('이미지 없음', '#f3f4f6');

export default function ImagePage() {
  return (
    <DocPage
      title="Image"
      description="이미지 표시 컴포넌트. 클릭 미리보기, 로드 실패 대체 이미지, 그룹 미리보기를 지원합니다."
    >
      <Example
        title="기본"
        description="이미지에 마우스를 올리면 미리보기 마스크가 나타나고, 클릭하면 오버레이가 열립니다."
        code={`<Image src="..." width={240} height={160} alt="sample" />`}
      >
        <Image src={IMG1} width={240} height={160} alt="sample" />
      </Example>

      <Example
        title="Fallback"
        description="src 로드 실패 시 fallback 이미지를 표시합니다."
        code={`<Image src="broken-url" fallback={fallbackSrc} width={240} height={160} />`}
      >
        <Image src="broken-url" fallback={FALLBACK} width={240} height={160} alt="fallback" />
      </Example>

      <Example
        title="미리보기 비활성화"
        description="preview={false}로 클릭 미리보기를 끕니다."
        code={`<Image src="..." width={240} height={160} preview={false} />`}
      >
        <Image src={IMG1} width={240} height={160} preview={false} alt="no preview" />
      </Example>

      <Example
        title="그룹 미리보기"
        description="Image.Group으로 묶으면 미리보기에서 이전/다음 이동이 가능합니다."
        code={`
<Image.Group>
  <Image src={img1} width={160} height={110} />
  <Image src={img2} width={160} height={110} />
  <Image src={img3} width={160} height={110} />
</Image.Group>
        `}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Image.Group>
            <Image src={IMG1} width={160} height={110} alt="img1" />
            <Image src={IMG2} width={160} height={110} alt="img2" />
            <Image src={IMG3} width={160} height={110} alt="img3" />
          </Image.Group>
        </div>
      </Example>

      <PropsTable
        title="Image"
        rows={[
          { name: 'src', type: 'string', description: '이미지 URL' },
          { name: 'alt', type: 'string', description: '대체 텍스트' },
          { name: 'width', type: 'number | string', description: '너비' },
          { name: 'height', type: 'number | string', description: '높이' },
          { name: 'fallback', type: 'string', description: '로드 실패 시 대체 이미지 URL' },
          { name: 'placeholder', type: 'ReactNode | boolean', description: '로딩 중 플레이스홀더. true이면 기본 shimmer 효과' },
          { name: 'preview', type: 'boolean | ImagePreviewConfig', default: 'true', description: '미리보기 활성화 여부 또는 설정 객체' },
          { name: 'onError', type: 'ReactEventHandler<HTMLImageElement>', description: '이미지 로드 실패 콜백' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />

      <PropsTable
        title="ImagePreviewConfig"
        rows={[
          { name: 'open', type: 'boolean', description: '미리보기 열림 상태 (controlled)' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: '열림 상태 변경 콜백' },
          { name: 'mask', type: 'ReactNode', description: '마스크 오버레이 텍스트/아이콘' },
          { name: 'src', type: 'string', description: '미리보기 이미지 src (원본과 다를 때)' },
        ]}
      />

      <PropsTable
        title="Image.Group"
        rows={[
          { name: 'children', type: 'ReactNode', description: 'Image 컴포넌트 묶음' },
          { name: 'preview', type: 'boolean', default: 'true', description: '그룹 미리보기 활성화 여부' },
        ]}
      />
    </DocPage>
  );
}
