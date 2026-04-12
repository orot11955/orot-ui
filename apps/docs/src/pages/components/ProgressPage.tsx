import { Progress } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function ProgressPage() {
  const lineExampleStyle = { width: 'min(100%, 400px)' };

  return (
    <DocPage title="Progress" description="작업 진행 상태를 시각적으로 표시합니다.">
      <Example
        title="Line (기본)"
        code={`<Progress percent={30} />
<Progress percent={70} />
<Progress percent={100} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...lineExampleStyle }}>
          <Progress percent={30} />
          <Progress percent={70} />
          <Progress percent={100} />
        </div>
      </Example>

      <Example
        title="Status"
        code={`<Progress percent={70} status="exception" />
<Progress percent={100} status="success" />
<Progress percent={50} status="active" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...lineExampleStyle }}>
          <Progress percent={70} status="exception" />
          <Progress percent={100} status="success" />
          <Progress percent={50} status="active" />
        </div>
      </Example>

      <Example
        title="Custom Color"
        description="strokeColor / trailColor로 색상을 직접 지정합니다."
        code={`<Progress percent={60} strokeColor="var(--orot-color-info)" />
<Progress percent={80} strokeColor="#722ed1" trailColor="#f9f0ff" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...lineExampleStyle }}>
          <Progress percent={60} strokeColor="var(--orot-color-info)" />
          <Progress percent={80} strokeColor="#722ed1" trailColor="#f9f0ff" />
        </div>
      </Example>

      <Example
        title="Success segment"
        description="success.percent로 진행바 앞부분을 success 색상으로 표시합니다."
        code={`<Progress percent={70} success={{ percent: 30 }} />`}
      >
        <div style={lineExampleStyle}>
          <Progress percent={70} success={{ percent: 30 }} />
        </div>
      </Example>

      <Example
        title="Steps"
        description="steps로 분절된 진행바를 표시합니다."
        code={`<Progress steps={5} percent={60} />
<Progress steps={10} percent={40} size="sm" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...lineExampleStyle }}>
          <Progress steps={5} percent={60} />
          <Progress steps={10} percent={40} size="sm" />
        </div>
      </Example>

      <Example
        title="Small size"
        code={`<Progress percent={50} size="sm" />`}
      >
        <div style={lineExampleStyle}>
          <Progress percent={50} size="sm" />
        </div>
      </Example>

      <Example
        title="Circle"
        code={`<Progress type="circle" percent={75} />
<Progress type="circle" percent={100} />
<Progress type="circle" percent={50} status="exception" />`}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Progress type="circle" percent={75} />
          <Progress type="circle" percent={100} />
          <Progress type="circle" percent={50} status="exception" />
        </div>
      </Example>

      <Example
        title="Dashboard"
        description="type='dashboard'는 반원형 게이지 스타일입니다."
        code={`<Progress type="dashboard" percent={75} />
<Progress type="dashboard" percent={100} />`}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Progress type="dashboard" percent={75} />
          <Progress type="dashboard" percent={100} />
          <Progress type="dashboard" percent={50} status="exception" />
        </div>
      </Example>

      <Example
        title="Custom format"
        description="format 함수로 표시 텍스트를 커스터마이즈합니다."
        code={`<Progress percent={75} format={(p) => \`\${p} / 100\`} />
<Progress type="circle" percent={75} format={(p) => \`\${p}점\`} />`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 'min(100%, 300px)', flex: '1 1 300px' }}>
            <Progress percent={75} format={(p) => `${p} / 100`} />
          </div>
          <Progress type="circle" percent={75} format={(p) => `${p}점`} />
        </div>
      </Example>

      <Example
        title="No info"
        code={`<Progress percent={60} showInfo={false} />`}
      >
        <div style={lineExampleStyle}>
          <Progress percent={60} showInfo={false} />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'type', type: "'line' | 'circle' | 'dashboard'", default: "'line'", description: '진행바 타입' },
          { name: 'percent', type: 'number', default: '0', description: '진행률 (0~100)' },
          { name: 'status', type: "'normal' | 'success' | 'exception' | 'active'", default: "'normal'", description: '상태. 100%일 때 자동으로 success 처리' },
          { name: 'showInfo', type: 'boolean', default: 'true', description: '퍼센트 텍스트 표시' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '크기 (line 전용)' },
          { name: 'strokeWidth', type: 'number', description: '선 두께 (px). 미지정 시 size에 따라 자동' },
          { name: 'strokeColor', type: 'string', description: '진행 색상 (CSS 값)' },
          { name: 'trailColor', type: 'string', description: '트랙 배경 색상 (CSS 값)' },
          { name: 'steps', type: 'number', description: '분절 진행바의 칸 수 (line 전용)' },
          { name: 'success', type: '{ percent?: number; strokeColor?: string }', description: '앞쪽 success 구간 설정' },
          { name: 'format', type: '(percent: number) => string', description: '텍스트 포맷 함수' },
        ]}
      />
    </DocPage>
  );
}
