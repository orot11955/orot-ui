import { useRef, useState } from 'react';
import { Tour, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

function BasicTourExample() {
  const ref1 = useRef<HTMLSpanElement>(null);
  const ref2 = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: 'Step 1',
      description: 'This is the first step of the tour.',
      target: () => ref1.current,
    },
    {
      title: 'Step 2',
      description: 'This is the second step of the tour.',
      target: () => ref2.current,
    },
    {
      title: 'Step 3',
      description: 'Tour complete! Click Finish to close.',
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <span ref={ref1}><Button variant="outlined">Step 1 Target</Button></span>
        <span ref={ref2}><Button variant="outlined">Step 2 Target</Button></span>
        <Button onClick={() => setOpen(true)}>Start Tour</Button>
      </div>
      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </>
  );
}

export default function TourPage() {
  return (
    <DocPage title="Tour" description="단계별로 UI 요소를 안내하는 가이드 투어입니다.">
      <Example
        title="기본"
        code={`const ref1 = useRef(null);
const ref2 = useRef(null);
const [open, setOpen] = useState(false);

const steps = [
  { title: 'Step 1', description: 'First step.', target: () => ref1.current },
  { title: 'Step 2', description: 'Second step.', target: () => ref2.current },
];

<span ref={ref1}><Button variant="outlined">Step 1 Target</Button></span>
<span ref={ref2}><Button variant="outlined">Step 2 Target</Button></span>
<Button onClick={() => setOpen(true)}>Start Tour</Button>

<Tour open={open} steps={steps} onClose={() => setOpen(false)} onFinish={() => setOpen(false)} />`}
      >
        <BasicTourExample />
      </Example>

      <PropsTable
        rows={[
          { name: 'open', type: 'boolean', default: 'false', description: '투어 표시 여부' },
          { name: 'steps', type: 'TourStep[]', description: '투어 단계 목록' },
          { name: 'current', type: 'number', description: '현재 단계 (controlled)' },
          { name: 'defaultCurrent', type: 'number', default: '0', description: '초기 단계' },
          { name: 'mask', type: 'boolean', default: 'true', description: '배경 마스크 표시' },
          { name: 'arrow', type: 'boolean', default: 'true', description: '화살표 표시' },
          { name: 'placement', type: 'TourPlacement', default: "'bottom'", description: '기본 표시 위치' },
          { name: 'zIndex', type: 'number', default: '1001', description: 'z-index' },
          { name: 'onClose', type: '() => void', description: '닫기 콜백' },
          { name: 'onChange', type: '(current: number) => void', description: '단계 변경 콜백' },
          { name: 'onFinish', type: '() => void', description: '투어 완료 콜백' },
        ]}
      />

      <PropsTable
        title="TourStep Props"
        rows={[
          { name: 'title', type: 'ReactNode', description: '단계 제목' },
          { name: 'description', type: 'ReactNode', description: '단계 설명' },
          { name: 'target', type: '() => HTMLElement | null', description: '대상 엘리먼트' },
          { name: 'placement', type: 'TourPlacement', description: '이 단계의 위치 (투어 기본값 덮어씀)' },
          { name: 'mask', type: 'boolean', description: '이 단계의 마스크 여부' },
          { name: 'nextButtonProps', type: 'ButtonProps', description: '다음 버튼 props' },
          { name: 'prevButtonProps', type: 'ButtonProps', description: '이전 버튼 props' },
        ]}
      />
    </DocPage>
  );
}
