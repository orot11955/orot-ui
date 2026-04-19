# orot-ui

React 18+ 기반의 재사용 가능한 UI 컴포넌트 라이브러리입니다.  
Ant Design에서 영감을 받은 구조를 바탕으로, `Button`, `Form`, `Table`, `Modal`, `Tabs`, `DatePicker`, `Tree`, `MarkdownEditor` 등 다양한 화면 구성을 빠르게 조합할 수 있도록 설계되어 있습니다.

문서 사이트는 다음 주소로 배포할 예정입니다.

- https://ui.2juho.com

## Features

- React 18 이상 지원
- TypeScript 타입 선언 제공
- ESM / CJS 동시 출력
- `pnpm` 워크스페이스 기반 개발 환경
- 문서 앱(`apps/docs`)으로 컴포넌트 예제와 사용법 관리
- 글로벌 스타일 및 테마 CSS 별도 제공

## Project Structure

```text
orot-ui/
├─ src/              # 라이브러리 소스
├─ dist/             # 라이브러리 빌드 산출물
├─ apps/docs/        # Vite 기반 문서 사이트
├─ package.json
├─ tsup.config.ts
└─ pnpm-workspace.yaml
```

## Getting Started

```bash
pnpm install
```

라이브러리 개발:

```bash
pnpm dev
```

문서 사이트 개발:

```bash
pnpm dev:docs
```

docs 앱의 버전 표기는 루트 `package.json`의 `"version"`을 기준으로 자동 반영됩니다.
즉, 릴리즈 버전은 루트 패키지 한 곳만 수정하면 문서 헤더/홈 배지/예제 표시가 함께 따라갑니다.

라이브러리 빌드:

```bash
pnpm build
```

문서 사이트 빌드:

```bash
pnpm build:docs
```

## Publishing

`npm publish`는 이 저장소 전체를 배포하는 명령이 아니라, 현재 위치의 npm 패키지 하나를 배포합니다.

- 루트 `orot-ui` 패키지는 npm 배포 대상입니다.
- `apps/docs`는 `"private": true`라서 npm에 publish되지 않습니다.
- 문서 사이트는 npm publish가 아니라 별도 호스팅으로 배포해야 합니다.

배포 전에 포함 파일을 확인하려면:

```bash
npm run pack:dry-run
```

실제 publish 직전 검증:

```bash
npm run publish:dry-run
```

워크스페이스 전체 기준으로 확인하려면:

```bash
npm run publish:all:dry-run
```

이 경우 루트 `orot-ui`는 publish 대상으로 잡히고, `apps/docs`는 `private` 패키지라 자동으로 skip됩니다.

실제 publish 시에는 `prepublishOnly`로 라이브러리 빌드가 자동 실행됩니다.

## Usage

기본 사용 예시입니다.

```tsx
import { Button, Card, Input } from 'orot-ui';
import 'orot-ui/dist/index.css';

export function Example() {
  return (
    <Card title="orot-ui">
      <Input placeholder="Type here" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

전역 스타일과 테마 파일은 다음 경로로도 사용할 수 있습니다.

```tsx
import 'orot-ui/styles/global.css';
import 'orot-ui/themes/base.css';
import 'orot-ui/themes/light.css';
```

사용 가능한 테마 파일:

- `orot-ui/themes/base.css`
- `orot-ui/themes/light.css`
- `orot-ui/themes/dark.css`
- `orot-ui/themes/sepia.css`
- `orot-ui/themes/ocean.css`
- `orot-ui/themes/forest.css`

## Component Coverage

현재 라이브러리에는 60개 이상의 컴포넌트가 포함되어 있습니다. 대표 범주는 아래와 같습니다.

- General: `Button`, `Typography`, `Icon`, `Divider`
- Layout: `Space`, `Flex`, `Grid`, `Layout`, `Splitter`, `Masonry`
- Navigation: `Tabs`, `Menu`, `Breadcrumb`, `Dropdown`, `Pagination`, `Anchor`
- Data Entry: `Input`, `Select`, `Checkbox`, `Radio`, `Switch`, `DatePicker`, `Form`, `Upload`
- Data Display: `Avatar`, `Card`, `Tag`, `Badge`, `Table`, `Descriptions`, `Tree`, `Calendar`
- Feedback: `Alert`, `Drawer`, `Modal`, `Spin`, `Skeleton`, `Notification`, `Message`
- Advanced: `Steps`, `Result`, `Popconfirm`, `Tour`, `Toc`, `MarkdownEditor`

## Docs

문서 앱은 `apps/docs`에서 관리하며, 로컬에서는 Vite로 실행됩니다.

```bash
pnpm dev:docs
```

배포 대상 주소:

- https://ui.2juho.com

Docker Compose로 docs를 띄우려면 루트 `orot-ui`에서 아래처럼 실행하면 됩니다.

```bash
DOCS_PORT=8080 docker compose up -d --build docs
```

`.env.example`를 복사해 `.env`로 두고 포트를 관리해도 됩니다.

또는 package script를 사용할 수 있습니다.

```bash
pnpm docker:docs:up
pnpm docker:docs:logs
pnpm docker:docs:down
```

기본 포트는 `8080`이며, `DOCS_PORT` 환경변수로 변경할 수 있습니다.

## Build Output

라이브러리 빌드는 `tsup`으로 수행되며 아래 결과물을 생성합니다.

- `dist/index.js`
- `dist/index.mjs`
- `dist/index.d.ts`
- `dist/index.css`

## Peer Dependencies

- `react >= 18`
- `react-dom >= 18`

## Development Notes

- 패키지 매니저는 `pnpm`을 사용합니다.
- 문서 사이트는 워크스페이스 패키지 `orot-ui`를 직접 참조합니다.
- 배포 전에는 `pnpm build`와 `pnpm build:docs`로 라이브러리와 문서 결과물을 각각 확인하는 것을 권장합니다.
