import { useState } from 'react';
import { MarkdownEditor } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const INITIAL_CONTENT = `# Bear-style Markdown Editor

Write in **markdown** and see it rendered *live* — no preview toggle needed.

## Inline Formatting

- **Bold**: wrap text with \`**\`
- *Italic*: wrap text with \`*\`
- ~~Strikethrough~~: wrap text with \`~~\`
- \`Inline code\`: wrap text with a backtick
- ==Highlight==: wrap text with \`==\`
- [Link](https://example.com): use \`[text](url)\`

## Task Lists

- [x] Build WYSIWYG markdown editor
- [x] Add syntax highlighting for markers
- [ ] Add image drag-and-drop
- [ ] Add table support

## Blockquote

> The best time to plant a tree was 20 years ago.
> The second best time is now.

## Code Block

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

---

Try the toolbar above or use keyboard shortcuts:
**⌘B** Bold · **⌘I** Italic · **⌘K** Link · **⌘E** Inline code
`;

export default function MarkdownEditorPage() {
  const [controlled, setControlled] = useState('# Controlled Editor\n\nEdit me!');

  return (
    <DocPage
      title="MarkdownEditor"
      description="Bear-inspired WYSIWYG markdown editor. Syntax markers remain visible but styled — you edit the formatted text directly, with no separate preview pane."
    >
      <Example
        title="기본 (WYSIWYG)"
        code={`<MarkdownEditor defaultValue="# Hello\\n\\nStart **writing**..." />`}
      >
        <MarkdownEditor defaultValue={INITIAL_CONTENT} minHeight={400} />
      </Example>

      <Example
        title="툴바 없음"
        code={`<MarkdownEditor showToolbar={false} defaultValue="# No Toolbar\\n\\nUse keyboard shortcuts only." />`}
      >
        <MarkdownEditor
          showToolbar={false}
          defaultValue="# No Toolbar\n\nUse **keyboard shortcuts** only.\n\n- ⌘B bold\n- ⌘I italic\n- ⌘K link"
          minHeight={200}
        />
      </Example>

      <Example
        title="Controlled (제어 컴포넌트)"
        code={`const [value, setValue] = useState('# Controlled Editor\\n\\nEdit me!');

<MarkdownEditor value={value} onChange={setValue} />
<pre>{value}</pre>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MarkdownEditor
            value={controlled}
            onChange={setControlled}
            minHeight={200}
          />
          <pre
            style={{
              margin: 0,
              padding: '12px 16px',
              background: 'var(--orot-color-bg-secondary)',
              border: '1px solid var(--orot-color-border)',
              borderRadius: 'var(--orot-radius-md)',
              fontSize: 'var(--orot-font-size-sm)',
              color: 'var(--orot-color-text-secondary)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {controlled}
          </pre>
        </div>
      </Example>

      <Example
        title="읽기 전용 (ReadOnly)"
        code={`<MarkdownEditor readOnly defaultValue="# Read Only\n\nThis editor cannot be edited." />`}
      >
        <MarkdownEditor
          readOnly
          showToolbar={false}
          defaultValue={`# Read Only\n\nThis content is **rendered** but *not editable*.\n\n- Item A\n- Item B\n\n> A read-only blockquote.\n\n\`\`\`js\nconsole.log('hello');\n\`\`\``}
          minHeight={180}
        />
      </Example>

      <Example
        title="Word Count 없음"
        code={`<MarkdownEditor showWordCount={false} />`}
      >
        <MarkdownEditor
          showWordCount={false}
          defaultValue="# No Footer\n\nWord count is hidden."
          minHeight={120}
        />
      </Example>

      <Example
        title="높이 제한 (maxHeight 스크롤)"
        code={`<MarkdownEditor minHeight={100} maxHeight={200} defaultValue={longContent} />`}
      >
        <MarkdownEditor
          minHeight={100}
          maxHeight={200}
          defaultValue={Array.from({ length: 20 }, (_, i) => `Line ${i + 1}: Some content here.`).join('\n')}
        />
      </Example>

      <PropsTable
        rows={[
          {
            name: 'value',
            type: 'string',
            description: '제어 모드 — 외부에서 관리하는 마크다운 문자열',
          },
          {
            name: 'defaultValue',
            type: 'string',
            default: "''",
            description: '비제어 모드의 초기값',
          },
          {
            name: 'onChange',
            type: '(value: string) => void',
            description: '내용이 변경될 때마다 호출 (raw 마크다운 문자열 전달)',
          },
          {
            name: 'placeholder',
            type: 'string',
            default: "'Start writing...'",
            description: '에디터가 비어있을 때 표시할 안내 문구',
          },
          {
            name: 'readOnly',
            type: 'boolean',
            default: 'false',
            description: '읽기 전용 모드',
          },
          {
            name: 'showToolbar',
            type: 'boolean',
            default: 'true',
            description: '서식 툴바 표시 여부',
          },
          {
            name: 'showWordCount',
            type: 'boolean',
            default: 'true',
            description: '하단 단어/글자 수 표시 여부',
          },
          {
            name: 'minHeight',
            type: 'number | string',
            default: '320',
            description: '에디터 최소 높이 (숫자는 px)',
          },
          {
            name: 'maxHeight',
            type: 'number | string',
            description: '에디터 최대 높이 — 초과 시 스크롤',
          },
          {
            name: 'autoFocus',
            type: 'boolean',
            default: 'false',
            description: '마운트 시 자동 포커스',
          },
          {
            name: 'onImageUpload',
            type: '(file: File) => Promise<string>',
            description:
              '이미지 파일 선택/드롭 시 호출. URL 반환 시 ![name](url) 삽입. 미지정 시 data-URL 사용',
          },
        ]}
      />

      <div
        style={{
          marginTop: 32,
          padding: '16px 20px',
          background: 'var(--orot-color-bg-secondary)',
          borderRadius: 'var(--orot-radius-md)',
          border: '1px solid var(--orot-color-border)',
          fontSize: 'var(--orot-font-size-sm)',
          color: 'var(--orot-color-text-secondary)',
          lineHeight: 'var(--orot-line-height-loose)',
        }}
      >
        <strong style={{ color: 'var(--orot-color-text)' }}>지원 문법</strong>
        <br />
        <code># H1</code> · <code>## H2</code> ~ <code>###### H6</code> ·{' '}
        <code>**bold**</code> · <code>*italic*</code> · <code>~~strike~~</code>{' '}
        · <code>==highlight==</code> · <code>`code`</code> ·{' '}
        <code>[text](url)</code> · <code>![alt](url)</code> ·{' '}
        <code>- [ ] task</code> · <code>- [x] done</code> ·{' '}
        <code>&gt; blockquote</code> · <code>```lang</code> · <code>---</code>
        <br />
        <br />
        <strong style={{ color: 'var(--orot-color-text)' }}>단축키</strong>
        <br />
        <code>⌘B</code> Bold · <code>⌘I</code> Italic · <code>⌘K</code> Link ·{' '}
        <code>⌘E</code> Inline code · <code>Tab</code> Indent ·{' '}
        <code>⇧Tab</code> Unindent · <code>Enter</code> 리스트 자동 계속 ·{' '}
        이미지 드래그 앤 드롭 지원
      </div>
    </DocPage>
  );
}
