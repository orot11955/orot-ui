import { useState } from 'react';
import { Toc } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const SAMPLE_MARKDOWN = `
# Introduction
Welcome to the component library.

## Getting Started
Learn how to install and use the library.

### Installation
Run the install command to add the package.

### Basic Usage
Import and use components in your project.

## Components
Browse the available components.

### Buttons
Interactive action triggers.

### Forms
Data entry elements.

## Configuration
Advanced configuration options.

### Theming
Customize the visual appearance.

### Internationalization
Support for multiple languages.
`;

const FLAT_ITEMS = [
  { id: 'overview', text: 'Overview', level: 1 },
  { id: 'api', text: 'API Reference', level: 2 },
  { id: 'props', text: 'Props', level: 3 },
  { id: 'methods', text: 'Methods', level: 3 },
  { id: 'events', text: 'Events', level: 2 },
  { id: 'examples', text: 'Examples', level: 2 },
  { id: 'basic', text: 'Basic', level: 3 },
  { id: 'advanced', text: 'Advanced', level: 3 },
];

export default function TocPage() {
  const [activeId, setActiveId] = useState<string | undefined>('api');

  return (
    <DocPage
      title="Toc"
      description="마크다운 문서의 목차를 렌더링하는 컴포넌트입니다. 마크다운 텍스트를 파싱하거나 직접 항목을 제공할 수 있습니다."
    >
      <Example
        title="마크다운에서 자동 파싱"
        description="markdown prop에 마크다운 텍스트를 전달하면 헤딩을 자동으로 파싱해 목차를 생성합니다."
        code={`<Toc markdown={markdownText} />`}
      >
        <div style={{ width: 240, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
          <Toc markdown={SAMPLE_MARKDOWN} />
        </div>
      </Example>

      <Example
        title="직접 항목 제공"
        description="items prop으로 미리 파싱된 항목 배열을 전달할 수 있습니다."
        code={`<Toc items={[
  { id: 'overview', text: 'Overview', level: 1 },
  { id: 'api', text: 'API Reference', level: 2 },
  { id: 'props', text: 'Props', level: 3 },
  { id: 'methods', text: 'Methods', level: 3 },
]} />`}
      >
        <div style={{ width: 240, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
          <Toc items={FLAT_ITEMS} />
        </div>
      </Example>

      <Example
        title="활성 항목 제어"
        description="activeId로 현재 활성 항목을 표시합니다."
        code={`const [activeId, setActiveId] = useState('api');

<Toc
  items={items}
  activeId={activeId}
  onClick={(id) => setActiveId(id)}
/>`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 240, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
            <Toc
              items={FLAT_ITEMS}
              activeId={activeId}
              onClick={(id) => setActiveId(id)}
              smooth={false}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--orot-color-text-muted)', paddingTop: 8 }}>
            Active: <code style={{ background: 'var(--orot-color-fill-secondary)', padding: '1px 6px', borderRadius: 3 }}>{activeId ?? 'none'}</code>
          </div>
        </div>
      </Example>

      <Example
        title="depth 제한"
        description="maxDepth로 포함할 헤딩 수준을 제한합니다 (기본값: 3)."
        code={`<Toc markdown={markdownText} maxDepth={2} />`}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--orot-color-text-muted)', marginBottom: 8 }}>maxDepth=2</div>
            <div style={{ width: 200, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
              <Toc markdown={SAMPLE_MARKDOWN} maxDepth={2} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--orot-color-text-muted)', marginBottom: 8 }}>maxDepth=3</div>
            <div style={{ width: 220, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
              <Toc markdown={SAMPLE_MARKDOWN} maxDepth={3} />
            </div>
          </div>
        </div>
      </Example>

      <Example
        title="들여쓰기 없음"
        description="indent={false}로 평면 목록을 렌더링합니다."
        code={`<Toc markdown={markdownText} indent={false} />`}
      >
        <div style={{ width: 240, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
          <Toc markdown={SAMPLE_MARKDOWN} indent={false} />
        </div>
      </Example>

      <Example
        title="커스텀 제목"
        description="title prop으로 목차 상단 제목을 변경합니다."
        code={`<Toc markdown={markdownText} title="목차" />`}
      >
        <div style={{ width: 240, border: '1px solid var(--orot-color-border)', borderRadius: 8, padding: 16 }}>
          <Toc markdown={SAMPLE_MARKDOWN} title="목차" maxDepth={2} />
        </div>
      </Example>

      <PropsTable
        rows={[
          { name: 'markdown', type: 'string', description: '파싱할 마크다운 텍스트 (items와 중복 사용 불가)' },
          { name: 'items', type: 'TocItem[]', description: '미리 파싱된 항목 배열 (markdown과 중복 사용 불가)' },
          { name: 'activeId', type: 'string', description: '현재 활성 헤딩 id (controlled)' },
          { name: 'maxDepth', type: 'number', default: '3', description: '포함할 최대 헤딩 수준 (1~6)' },
          { name: 'title', type: 'ReactNode', default: "'On this page'", description: '목차 상단 제목. false로 숨김 가능' },
          { name: 'indent', type: 'boolean', default: 'true', description: '중첩 헤딩에 들여쓰기 적용' },
          { name: 'onClick', type: '(id: string) => void', description: '항목 클릭 콜백' },
          { name: 'smooth', type: 'boolean', default: 'true', description: '클릭 시 부드러운 스크롤' },
          { name: 'observe', type: 'boolean', default: 'false', description: 'IntersectionObserver로 스크롤 위치 감지 및 activeId 자동 업데이트' },
        ]}
      />

      <PropsTable
        title="TocItem"
        rows={[
          { name: 'id', type: 'string', description: '헤딩 id (앵커 링크에 사용)' },
          { name: 'text', type: 'string', description: '헤딩 텍스트' },
          { name: 'level', type: 'number', description: '헤딩 수준 (1~6)' },
          { name: 'children', type: 'TocItem[]', description: '하위 항목 (트리 구조일 때)' },
        ]}
      />
    </DocPage>
  );
}
