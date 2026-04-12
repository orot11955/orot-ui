import { Carousel } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const slideStyle: React.CSSProperties = {
  height: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  borderRadius: 8,
};

const slides = [
  { bg: 'var(--orot-color-primary)', label: '1' },
  { bg: 'var(--orot-color-success)', label: '2' },
  { bg: 'var(--orot-color-warning)', label: '3' },
  { bg: 'var(--orot-color-error)', label: '4' },
];

export default function CarouselPage() {
  return (
    <DocPage title="Carousel" description="슬라이드 전환 효과로 콘텐츠를 순환 표시합니다.">
      <Example
        title="기본"
        code={`<Carousel>
  <div style={{ background: 'var(--orot-color-primary)', height: 120 }}>1</div>
  <div style={{ background: 'var(--orot-color-success)', height: 120 }}>2</div>
  <div style={{ background: 'var(--orot-color-warning)', height: 120 }}>3</div>
</Carousel>`}
      >
        <Carousel>
          {slides.map(s => (
            <div key={s.label} style={{ ...slideStyle, background: s.bg }}>{s.label}</div>
          ))}
        </Carousel>
      </Example>

      <Example
        title="Fade Effect"
        code={`<Carousel effect="fade">...</Carousel>`}
      >
        <Carousel effect="fade">
          {slides.map(s => (
            <div key={s.label} style={{ ...slideStyle, background: s.bg }}>{s.label}</div>
          ))}
        </Carousel>
      </Example>

      <Example
        title="Autoplay"
        code={`<Carousel autoplay autoplaySpeed={2000}>...</Carousel>`}
      >
        <Carousel autoplay autoplaySpeed={2000}>
          {slides.map(s => (
            <div key={s.label} style={{ ...slideStyle, background: s.bg }}>{s.label}</div>
          ))}
        </Carousel>
      </Example>

      <Example
        title="Arrows"
        code={`<Carousel arrows>...</Carousel>`}
      >
        <Carousel arrows>
          {slides.map(s => (
            <div key={s.label} style={{ ...slideStyle, background: s.bg }}>{s.label}</div>
          ))}
        </Carousel>
      </Example>

      <Example
        title="No Dots"
        code={`<Carousel dots={false} arrows>...</Carousel>`}
      >
        <Carousel dots={false} arrows>
          {slides.map(s => (
            <div key={s.label} style={{ ...slideStyle, background: s.bg }}>{s.label}</div>
          ))}
        </Carousel>
      </Example>

      <PropsTable
        rows={[
          { name: 'effect', type: "'scrollx' | 'fade'", default: "'scrollx'", description: '전환 효과' },
          { name: 'autoplay', type: 'boolean', default: 'false', description: '자동 재생' },
          { name: 'autoplaySpeed', type: 'number', default: '3000', description: '자동 재생 간격 (ms)' },
          { name: 'dots', type: 'boolean | { className }', default: 'true', description: '도트 네비게이션 표시' },
          { name: 'dotPosition', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: '도트 위치' },
          { name: 'arrows', type: 'boolean', default: 'false', description: '이전/다음 화살표 표시' },
          { name: 'infinite', type: 'boolean', default: 'true', description: '무한 반복' },
          { name: 'speed', type: 'number', default: '500', description: '전환 속도 (ms)' },
          { name: 'activeIndex', type: 'number', description: '현재 슬라이드 인덱스 (controlled)' },
          { name: 'defaultActiveIndex', type: 'number', default: '0', description: '초기 슬라이드 인덱스' },
          { name: 'beforeChange', type: '(from, to) => void', description: '슬라이드 변경 전 콜백' },
          { name: 'afterChange', type: '(current) => void', description: '슬라이드 변경 후 콜백' },
        ]}
      />
    </DocPage>
  );
}
