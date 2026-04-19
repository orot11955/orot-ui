import { useState } from 'react';
import { MarkdownEditor } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';

const INITIAL_CONTENT = `# 베어 스타일 마크다운 에디터

**마크다운**으로 입력하면 별도 미리보기 전환 없이 서식이 바로 반영됩니다.

#design, #writing 같은 태그는 pill 형태로 표시됩니다. URL은 자동으로 링크 처리됩니다: https://example.com.

## 인라인 서식

- **굵게**, *기울임*, ~~취소선~~, \`인라인 코드\`, ==형광펜==
- [링크](https://example.com) 또는 선택한 텍스트 위에 URL 붙여넣기
- 해시태그: #inspiration #product

## 작업 목록

- [x] 체크박스를 클릭해 완료 상태 토글
- [x] 문법을 인식하는 선택 툴바
- [ ] 이 에디터 위에 노트 앱 만들기
- [ ] 해시태그, 표, 자동 링크 사용해 보기

## 표

| 기능            | 단축키 | 상태 |
| --------------- | ------ | ---- |
| 굵게            | ⌘B     | ✓    |
| 제목 1          | ⌘1     | ✓    |
| 작업 목록       | ⌘⇧U    | ✓    |
| 순서 없는 목록  | ⌘⇧8    | ✓    |

## 인용문

> 나무를 심기에 가장 좋은 때는 20년 전이었다.
> 두 번째로 좋은 때는 바로 지금이다.

## 코드 블록

\`\`\`ts
function greet(name: string): string {
  return \`안녕하세요, \${name}!\`;
}
\`\`\`

---

텍스트를 선택하면 위쪽에 **플로팅 툴바**가 나타납니다.
`;

const THUMBNAIL_IMAGE_MAP = {
  'https://picsum.photos/id/1035/1280/720': {
    displaySrc: 'https://picsum.photos/id/1035/480/270',
    previewSrc: 'https://picsum.photos/id/1035/1280/720',
    width: 480,
    height: 270,
  },
  'https://picsum.photos/id/1025/1200/900': {
    displaySrc: 'https://picsum.photos/id/1025/360/270',
    previewSrc: 'https://picsum.photos/id/1025/1200/900',
    width: 360,
    height: 270,
  },
} as const;

const THUMBNAIL_CONTENT = `## 사진이 많은 문서

썸네일만 본문에 그려서 가볍게 스크롤하고, 미리보기 상태에서 사진을 클릭하면 원본을 볼 수 있습니다.

![바다](https://picsum.photos/id/1035/1280/720)

중간 설명 텍스트가 길어져도 본문에서는 가벼운 이미지만 유지합니다.

![강아지](https://picsum.photos/id/1025/1200/900)
`;

const resolveImageSource = (url: string) => THUMBNAIL_IMAGE_MAP[url as keyof typeof THUMBNAIL_IMAGE_MAP] ?? null;

const ASYNC_UPLOAD_INITIAL = `## 비동기 이미지 업로드

여러 이미지를 한 번에 넣어도 본문 순서는 유지됩니다.

`;

function escapeSvgText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createUploadPreviewSvg(name: string, hue: number): string {
  const label = name.length > 18 ? `${name.slice(0, 18)}…` : name;
  const palette =
    hue > 100
      ? {
          outer: '#dceeff',
          inner: '#b6d7ff',
          text: '#14314f',
        }
      : {
          outer: '#ffe8d8',
          inner: '#ffc9a3',
          text: '#5b2b14',
        };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270"><rect width="480" height="270" rx="28" fill="${palette.outer}"/><rect x="28" y="28" width="424" height="214" rx="20" fill="${palette.inner}"/><text x="240" y="122" text-anchor="middle" font-family="monospace" font-size="18" fill="${palette.text}">upload complete</text><text x="240" y="154" text-anchor="middle" font-family="monospace" font-size="20" fill="${palette.text}">${escapeSvgText(label)}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function demoImageUpload(file: File): Promise<string> {
  const lower = file.name.toLowerCase();
  const delay = lower.includes('fast') || lower.includes('2') ? 90 : 280;
  const hue = lower.includes('fast') || lower.includes('2') ? 204 : 26;
  await new Promise((resolve) => window.setTimeout(resolve, delay));
  return createUploadPreviewSvg(file.name, hue);
}

export default function MarkdownEditorPage() {
  const [controlled, setControlled] = useState('# 제어형 에디터\n\n내용을 수정해 보세요!');
  const [lastTag, setLastTag] = useState<string | null>(null);
  const [uploadDemoValue, setUploadDemoValue] = useState(ASYNC_UPLOAD_INITIAL);

  return (
    <DocPage
      title="MarkdownEditor"
      description="Bear 스타일을 참고한 WYSIWYG 마크다운 에디터입니다. 문법 표시는 숨기지 않고 자연스럽게 스타일링해 별도 프리뷰 패널 없이 서식이 적용된 텍스트를 직접 편집할 수 있습니다. 해시태그, 자동 링크, 표, 작업 목록 토글, 플로팅 툴바, URL 스마트 붙여넣기, 다양한 키보드 단축키를 지원합니다."
    >
      <Example
        title="기본 (WYSIWYG)"
        code={`<MarkdownEditor defaultValue="# 안녕하세요\\n\\n**작성**을 시작해 보세요..." />`}
      >
        <MarkdownEditor defaultValue={INITIAL_CONTENT} minHeight={520} />
      </Example>

      <Example
        title="해시태그 클릭 이벤트"
        code={`<MarkdownEditor
  onHashtagClick={(tag) => console.log('clicked', tag)}
  defaultValue="#inbox #today #focus - 태그를 클릭해 보세요"
/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MarkdownEditor
            onHashtagClick={setLastTag}
            defaultValue={`## 해시태그 필터링\n\n태그를 클릭하면 \`onHashtagClick\` 이 호출됩니다.\n\n#inbox #today #focus #writing #design`}
            minHeight={180}
          />
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--orot-color-bg-secondary)',
              border: '1px solid var(--orot-color-border)',
              borderRadius: 'var(--orot-radius-sm)',
              fontSize: 'var(--orot-font-size-sm)',
              color: 'var(--orot-color-text-secondary)',
            }}
          >
            마지막 클릭: {lastTag ? <code>#{lastTag}</code> : <em>없음</em>}
          </div>
        </div>
      </Example>

      <Example
        title="썸네일 렌더 + 원본 미리보기"
        code={`const resolveImageSource = (url) => ({
  displaySrc: thumbnailUrl,
  previewSrc: originalUrl,
  width: 480,
  height: 270,
});

<MarkdownEditor
  defaultValue={content}
  resolveImageSource={resolveImageSource}
/>`}
      >
        <MarkdownEditor
          defaultValue={THUMBNAIL_CONTENT}
          resolveImageSource={resolveImageSource}
          minHeight={320}
        />
      </Example>

      <Example
        title="비동기 이미지 업로드 (순서 유지)"
        description="이미지 버튼이나 드래그 앤 드롭으로 여러 파일을 넣으면, 업로드 완료 순서와 상관없이 본문 삽입 순서는 유지됩니다."
        code={`const [value, setValue] = useState(initialValue);

async function onImageUpload(file: File) {
  await delay(file.name.includes('fast') ? 90 : 280);
  return createUploadPreviewSvg(file.name);
}

<MarkdownEditor value={value} onChange={setValue} onImageUpload={onImageUpload} />
<pre>{value}</pre>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MarkdownEditor
            value={uploadDemoValue}
            onChange={setUploadDemoValue}
            onImageUpload={demoImageUpload}
            minHeight={260}
          />
          <pre
            data-qa="markdown-upload-output"
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
            {uploadDemoValue}
          </pre>
        </div>
      </Example>

      <Example
        title="상단 툴바 숨김"
        code={`<MarkdownEditor showToolbar={false} defaultValue="# 툴바 없음" />`}
      >
        <MarkdownEditor
          showToolbar={false}
          defaultValue="# 툴바 없음\n\n**키보드 단축키**만으로 편집해 보세요.\n\n- ⌘B 굵게\n- ⌘I 기울임\n- ⌘K 링크\n- ⌘1/2/3 제목\n- ⌘⇧U 작업 목록 · ⌘⇧8 목록"
          minHeight={200}
        />
      </Example>

      <Example
        title="제어 모드"
        code={`const [value, setValue] = useState('# 제어형 에디터\\n\\n내용을 수정해 보세요!');

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
        title="읽기 전용"
        code={`<MarkdownEditor readOnly defaultValue="# 읽기 전용" />`}
      >
        <MarkdownEditor
          readOnly
          showToolbar={false}
          defaultValue={`# 읽기 전용\n\n이 내용은 **렌더링**되지만 *편집할 수 없습니다*.\n\n- 항목 A\n- 항목 B\n\n> 읽기 전용 인용문 예시입니다.\n\n\`\`\`js\nconsole.log('hello');\n\`\`\``}
          minHeight={180}
        />
      </Example>

      <Example
        title="단어 수 표시 숨김"
        code={`<MarkdownEditor showWordCount={false} />`}
      >
        <MarkdownEditor
          showWordCount={false}
          defaultValue="# 하단 정보 숨김\n\n단어 수 표시가 숨겨집니다."
          minHeight={120}
        />
      </Example>

      <Example
        title="슬래시 커맨드 (/ 입력)"
        code={`<MarkdownEditor defaultValue="새 줄에서 / 를 입력해 보세요" />`}
      >
        <MarkdownEditor
          defaultValue={`# 슬래시 커맨드로 빠르게 삽입\n\n긴 글을 쓰다가 위 툴바까지 올라가지 않아도 됩니다. **새 줄에서 \`/\` 를 입력**하면 커서 위치에 메뉴가 열려요.\n\n- \`/heading\`, \`/제목\` 으로 제목 삽입\n- \`/task\`, \`/할일\` 로 체크리스트\n- \`/code\`, \`/table\`, \`/image\`, \`/link\` 지원\n- \`↑ ↓\` 로 이동, \`Enter\` 또는 \`Tab\` 으로 선택, \`Esc\` 로 닫기\n\n아래 빈 줄에서 직접 시도해 보세요 👇\n\n`}
          minHeight={320}
        />
      </Example>

      <Example
        title="슬래시 메뉴 비활성화"
        code={`<MarkdownEditor showSlashMenu={false} />`}
      >
        <MarkdownEditor
          showSlashMenu={false}
          defaultValue={`# 슬래시 메뉴 없음\n\n\`/\` 를 입력해도 메뉴가 열리지 않습니다.`}
          minHeight={140}
        />
      </Example>

      <Example
        title="플로팅 툴바 비활성화"
        code={`<MarkdownEditor showFloatingToolbar={false} />`}
      >
        <MarkdownEditor
          showFloatingToolbar={false}
          defaultValue="# 플로팅 툴바 없음\n\n텍스트를 선택해도 플로팅 툴바가 나타나지 않습니다.\n상단 툴바만 사용하고 싶을 때 유용합니다."
          minHeight={180}
        />
      </Example>

      <Example
        title="높이 제한 (maxHeight 스크롤)"
        code={`<MarkdownEditor minHeight={100} maxHeight={200} defaultValue={longContent} />`}
      >
        <MarkdownEditor
          minHeight={100}
          maxHeight={200}
          defaultValue={Array.from({ length: 20 }, (_, i) => `줄 ${i + 1}: 스크롤 동작을 확인하기 위한 예시 내용입니다.`).join('\n')}
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
            description: '에디터가 비어있을 때 표시할 플레이스홀더 문구',
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
            description: '상단 서식 툴바 표시 여부',
          },
          {
            name: 'showFloatingToolbar',
            type: 'boolean',
            default: 'true',
            description: '텍스트 선택 시 떠오르는 플로팅 서식 툴바 표시 여부',
          },
          {
            name: 'showSlashMenu',
            type: 'boolean',
            default: 'true',
            description:
              '줄 시작 또는 공백 뒤에 `/` 를 입력하면 커서 위치에 블록 삽입 메뉴 표시',
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
          {
            name: 'resolveImageSource',
            type: '(url: string, alt: string) => { displaySrc, previewSrc?, width?, height? }',
            description:
              '본문에는 썸네일(displaySrc), 클릭 미리보기에는 원본(previewSrc)을 연결할 때 사용',
          },
          {
            name: 'onHashtagClick',
            type: '(tag: string) => void',
            description: '해시태그(#tag) 클릭 시 호출 — 태그 기반 필터/검색 연동에 사용',
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
        <code># H1</code> ~ <code>###### H6</code> · <code>**bold**</code> ·{' '}
        <code>*italic*</code> · <code>~~strike~~</code> ·{' '}
        <code>==highlight==</code> · <code>`code`</code> ·{' '}
        <code>[text](url)</code> · <code>![alt](url)</code> ·{' '}
        <code>- [ ] task</code> / <code>- [x] done</code> ·{' '}
        <code>&gt; blockquote</code> · <code>```lang</code> · <code>---</code> ·{' '}
        <code>| cell | cell |</code> (파이프 테이블) · <code>#tag</code> (해시태그) ·{' '}
        자동 URL 링크
        <br />
        <br />
        <strong style={{ color: 'var(--orot-color-text)' }}>단축키</strong>
        <br />
        <code>⌘B</code> 굵게 · <code>⌘I</code> 기울임 · <code>⌘E</code> 인라인
        코드 · <code>⌘K</code> 링크 · <code>⌘⇧X</code> 취소선 ·{' '}
        <code>⌘⇧H</code> 형광펜 · <code>⌘1/2/3</code> 제목 1/2/3 ·{' '}
        <code>⌘⇧8</code> 목록 · <code>⌘⇧7</code> 번호 목록 ·{' '}
        <code>⌘⇧U</code> 작업 목록 · <code>⌘⇧.</code> 인용문 · <code>⌘Z</code>{' '}
        되돌리기 · <code>⌘⇧Z</code>/<code>Ctrl+Y</code> 다시 실행 ·{' '}
        <code>Tab</code> 들여쓰기 · <code>⇧Tab</code> 내어쓰기 · <code>Enter</code>{' '}
        리스트 자동 계속 · <code>⇧Enter</code> 소프트 줄바꿈
        <br />
        <br />
        <strong style={{ color: 'var(--orot-color-text)' }}>상호작용</strong>
        <br />
        · 체크박스 <code>[ ]</code>/<code>[x]</code> 클릭으로 완료 토글 · 이미지
        드래그 앤 드롭 · 썸네일 렌더 시 미리보기 상태에서 이미지 클릭 → 원본 보기 · 선택 영역 위에 URL 붙여넣기 →{' '}
        <code>[선택](url)</code> 자동 변환 · 텍스트 선택 시 플로팅 툴바 표시 ·{' '}
        <code>/</code> 입력 시 커서 위치에 슬래시 커맨드 메뉴 표시
      </div>
    </DocPage>
  );
}
