import { Statistic } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function StatisticPage() {
  return (
    <DocPage title="Statistic" description="통계 수치를 표시하는 컴포넌트입니다.">
      <Example
        title="기본"
        code={`<Statistic title="Active Users" value={112893} />`}
      >
        <div style={{ display: 'flex', gap: 32 }}>
          <Statistic title="Active Users" value={112893} />
          <Statistic title="Account Balance (CNY)" value={112893.12} precision={2} />
        </div>
      </Example>

      <Example
        title="Prefix / Suffix"
        code={`<Statistic title="Revenue" value={9280} prefix="$" suffix="USD" />`}
      >
        <div style={{ display: 'flex', gap: 32 }}>
          <Statistic title="Revenue" value={9280} prefix="$" />
          <Statistic title="Growth" value={12.5} suffix="%" precision={1} />
        </div>
      </Example>

      <Example
        title="Custom Formatter"
        code={`<Statistic title="Score" value={100} formatter={(v) => \`\${v} pts\`} />`}
      >
        <Statistic title="Score" value={100} formatter={(v) => `${v} pts`} />
      </Example>

      <Example
        title="Loading"
        code={`<Statistic title="Loading" value={0} loading />`}
      >
        <Statistic title="Loading..." value={0} loading />
      </Example>

      <Example
        title="Countdown"
        description="목표 시간까지 카운트다운을 표시합니다."
        code={`<Statistic.Countdown title="Countdown" value={Date.now() + 60000} />`}
      >
        <Statistic.Countdown title="Countdown (60s)" value={Date.now() + 60000} />
      </Example>

      <PropsTable
        rows={[
          { name: 'title', type: 'ReactNode', description: '제목' },
          { name: 'value', type: 'number | string', default: '0', description: '표시할 값' },
          { name: 'precision', type: 'number', description: '소수점 자릿수' },
          { name: 'prefix', type: 'ReactNode', description: '값 앞 내용' },
          { name: 'suffix', type: 'ReactNode', description: '값 뒤 내용' },
          { name: 'decimalSeparator', type: 'string', default: "'.'", description: '소수점 구분자' },
          { name: 'groupSeparator', type: 'string', default: "','", description: '천 단위 구분자' },
          { name: 'formatter', type: '(value) => ReactNode', description: '값 포맷터' },
          { name: 'loading', type: 'boolean', default: 'false', description: '로딩 상태' },
          { name: 'valueStyle', type: 'CSSProperties', description: '값 영역 스타일' },
        ]}
      />
    </DocPage>
  );
}
