import { Divider } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

export default function DividerPage() {
  return (
    <DocPage
      title="Divider"
      description="섹션 사이를 시각적으로 구분하는 구분선. 수평/수직, 점선, 레이블 텍스트를 지원합니다."
    >
      <Example
        title="기본"
        description="기본 수평 구분선."
        code={`
<p>위 내용</p>
<Divider />
<p>아래 내용</p>
        `}
      >
        <div style={{ width: '100%' }}>
          <p style={{ margin: 0 }}>위 내용</p>
          <Divider />
          <p style={{ margin: 0 }}>아래 내용</p>
        </div>
      </Example>

      <Example
        title="레이블"
        description="children 또는 label prop으로 텍스트를 삽입합니다. titlePlacement로 위치를 조정할 수 있습니다."
        code={`
<Divider>OR</Divider>
<Divider titlePlacement="left">섹션 제목</Divider>
<Divider titlePlacement="right">END</Divider>
        `}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Divider>OR</Divider>
          <Divider titlePlacement="left">섹션 제목</Divider>
          <Divider titlePlacement="right">END</Divider>
        </div>
      </Example>

      <Example
        title="Plain + Orientation Margin"
        code={`<Divider plain titlePlacement="left" orientationMargin={48}>
  Plain section
</Divider>`}
      >
        <div style={{ width: '100%' }}>
          <Divider plain titlePlacement="left" orientationMargin={48}>
            Plain section
          </Divider>
        </div>
      </Example>

      <Example
        title="점선 (dashed)"
        code={`
<Divider dashed />
<Divider dashed label="dashed + label" />
        `}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Divider dashed />
          <Divider dashed label="dashed + label" />
        </div>
      </Example>

      <Example
        title="수직 (vertical)"
        description="인라인 요소 사이에 삽입하는 수직 구분선."
        code={`
<span>텍스트</span>
<Divider type="vertical" />
<span>텍스트</span>
<Divider type="vertical" />
<span>텍스트</span>
        `}
      >
        <span>텍스트</span>
        <Divider type="vertical" />
        <span>텍스트</span>
        <Divider type="vertical" />
        <span>텍스트</span>
      </Example>

      <PropsTable
        rows={[
          { name: 'type', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '구분선 방향' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", description: 'type의 alias' },
          { name: 'dashed', type: 'boolean', default: 'false', description: '점선 스타일' },
          { name: 'children', type: 'ReactNode', description: '구분선 내부 레이블 (horizontal 전용)' },
          { name: 'label', type: 'ReactNode', description: 'children의 하위 호환 alias' },
          { name: 'titlePlacement', type: "'left' | 'center' | 'right'", default: "'center'", description: '레이블 위치' },
          { name: 'plain', type: 'boolean', default: 'false', description: '텍스트 강조를 줄인 스타일' },
          { name: 'orientationMargin', type: 'number | string', description: '좌/우 정렬 시 레이블 오프셋' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
          { name: 'style', type: 'CSSProperties', description: '인라인 스타일' },
        ]}
      />
    </DocPage>
  );
}
