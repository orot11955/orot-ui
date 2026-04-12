import { Result, Button } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function ResultPage() {
  return (
    <DocPage title="Result" description="작업 결과나 특수 페이지(404, 500 등)를 표시합니다.">
      <Example
        title="Success"
        code={`<Result
  status="success"
  title="Successfully Submitted!"
  subTitle="Your order has been placed. You will receive a confirmation email shortly."
  extra={<Button>Back to Home</Button>}
/>`}
      >
        <Result
          status="success"
          title="Successfully Submitted!"
          subTitle="Your order has been placed."
          extra={<Button>Back to Home</Button>}
        />
      </Example>

      <Example
        title="Error / Warning"
        code={`<Result status="error" title="Submission Failed" subTitle="Please check your input and try again." />`}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Result
            status="error"
            title="Submission Failed"
            subTitle="Please check your input."
            extra={<Button variant="outlined">Retry</Button>}
          />
          <Result
            status="warning"
            title="There are some problems"
            subTitle="Please review and confirm."
          />
        </div>
      </Example>

      <Example
        title="404 / 500"
        code={`<Result status="404" title="404" subTitle="Page not found." />
<Result status="500" title="500" subTitle="Server error." />`}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button>Back Home</Button>}
          />
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
          />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'status', type: "'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'", default: "'info'", description: '결과 타입' },
          { name: 'title', type: 'ReactNode', description: '제목' },
          { name: 'subTitle', type: 'ReactNode', description: '부제목' },
          { name: 'extra', type: 'ReactNode', description: '하단 버튼 영역' },
          { name: 'icon', type: 'ReactNode', description: '커스텀 아이콘 (기본 아이콘 대체)' },
        ]}
      />
    </DocPage>
  );
}
