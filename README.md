# Toby Design System

Token-driven React 컴포넌트 라이브러리 모노레포입니다.

Figma에서 정의한 Design Token이 코드와 자동으로 동기화되며,
모든 컴포넌트가 CSS Variables를 참조하는 구조로 설계되었습니다.

## Packages

| 패키지                                     | 설명                                           | npm                                                                                                                   |
| ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`@toby-design/tokens`](./packages/tokens) | Design Token (CSS Variables + TypeScript 상수) | [![npm](https://img.shields.io/npm/v/@toby-design/tokens)](https://www.npmjs.com/package/@toby-design/tokens)         |
| [`@toby-design/components`](./packages/ui) | React 컴포넌트 라이브러리 (10개)               | [![npm](https://img.shields.io/npm/v/@toby-design/components)](https://www.npmjs.com/package/@toby-design/components) |

## Components

| 컴포넌트   | 설명                                     |
| ---------- | ---------------------------------------- |
| Button     | 버튼 (primary, secondary, ghost, danger) |
| Input      | 텍스트 입력 필드                         |
| Select     | 드롭다운 선택                            |
| Badge      | 상태 라벨                                |
| Typography | 텍스트 (heading, body, caption)          |
| Card       | 콘텐츠 컨테이너                          |
| Dialog     | 모달 대화상자 (Focus Trap, ESC 닫기)     |
| Checkbox   | 체크박스                                 |
| Toast      | 알림 토스트 (Provider + useToast 훅)     |
| Tabs       | 탭 네비게이션 (키보드 접근성)            |

## 빠른 시작

```bash
npm install @toby-design/components
```

```tsx
import '@toby-design/components/styles.css';
import { Button, Input, Toast, ToastProvider } from '@toby-design/components';
```

## 개발 환경

```bash
# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# Storybook 실행
pnpm --filter docs storybook

# 테스트
pnpm test

# 토큰 동기화 (Figma JSON 변경 후)
pnpm sync
```

## 프로젝트 구조

```
toby-design-system/
├── packages/
│   ├── tokens/                 ← @toby-design/tokens
│   │   ├── raw/tokens.json     ← Figma Tokens Studio export
│   │   └── dist/               ← 생성된 CSS + TS
│   └── ui/                     ← @toby-design/components
│       └── src/
│           ├── Button/
│           ├── Input/
│           ├── Select/
│           ├── Badge/
│           ├── Typography/
│           ├── Card/
│           ├── Dialog/
│           ├── Checkbox/
│           ├── Toast/
│           └── Tabs/
├── apps/
│   └── docs/                   ← Storybook
├── scripts/
│   ├── sync-tokens.ts          ← 토큰 변환 스크립트
│   └── generate-component.ts   ← 컴포넌트 스캐폴딩
└── templates/                  ← 컴포넌트 템플릿
```

## 아키텍처

```
Figma Tokens Studio → tokens.json → sync-tokens.ts → CSS Variables
                                                          ↓
                                              컴포넌트 CSS Modules
                                              (var(--token-name) 참조)
                                                          ↓
                                                     Storybook
```

자세한 내용은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참고하세요.

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Components**: React 18 + TypeScript + CSS Modules
- **Tokens**: Figma Tokens Studio + 자동 변환 스크립트
- **Build**: tsup (ESM + CJS + DTS)
- **Test**: Vitest + Testing Library (54 tests)
- **Docs**: Storybook 10
- **CI/CD**: GitHub Actions + Changesets

## License

MIT
