# Design System MVP - Final Plan

## Project Goal

Figma Design Token을 기반으로 Token-driven React 컴포넌트 라이브러리를 구축하고,
Storybook 문서화 + npm 자동 배포 파이프라인까지 완성한다.

**Target:** 경력직 프론트엔드 개발자 포트폴리오

---

## MVP 범위 명확화

### 포함 (In Scope)

- Design Token 동기화 (수동 JSON → CSS Variables → TS 상수)
- CLI 기반 컴포넌트 템플릿 스캐폴딩
- 5~7개 핵심 컴포넌트 (Button, Input, Select, Badge, Typography, Card, Dialog)
- Storybook 문서화
- npm 배포 파이프라인 (Changesets + GitHub Actions)

### 제외 (Out of Scope) - MVP 이후

- Figma 디자인 → React 컴포넌트 완전 자동 변환
- Figma Plugin 개발
- Visual regression 테스트
- 다크/라이트 테마 자동 전환

---

## Figma 연동 전략 (무료 플랜)

### 제약사항

Figma Variables REST API는 **Enterprise 플랜 전용**입니다.
무료/Pro 플랜에서는 다음 방식으로 대응합니다.

### 선택지

| 방식 | 장점 | 단점 |
|------|------|------|
| **A. 수동 JSON 관리** | 단순, 의존성 없음 | Figma 변경 시 수동 동기화 |
| B. Figma Plugin 사용 | 반자동화 가능 | Plugin 설치/사용 필요 |
| C. Community Plugin | 무료, 빠름 | Plugin 의존성 |

### 추천: A. 수동 JSON 관리 (MVP)

1. Figma에서 디자인 토큰 정의 (Color, Typography, Spacing 등)
2. `tokens/raw/tokens.json`에 수동으로 값 입력/업데이트
3. CLI 스크립트로 CSS Variables + TS 상수 생성

**이유:**
- MVP에서는 토큰 변경 빈도가 낮음
- 외부 의존성 없이 파이프라인 완성 가능
- 나중에 Figma Plugin 연동으로 확장 가능

---

## Monorepo 구조

```
.
├── apps/
│   └── docs/                  # Storybook 문서 사이트
├── packages/
│   ├── tokens/                # Design Token (JSON → CSS → TS)
│   └── ui/                    # React 컴포넌트 라이브러리 (npm 배포)
├── scripts/                   # Token 변환 + Component scaffolding CLI
│   ├── sync-tokens.ts         # tokens.json → CSS/TS 변환
│   └── generate-component.ts  # 컴포넌트 템플릿 생성
├── templates/                 # Handlebars 컴포넌트 템플릿
│   ├── Component.tsx.hbs
│   ├── Component.module.css.hbs
│   ├── Component.stories.tsx.hbs
│   └── Component.test.tsx.hbs
├── .github/
│   └── workflows/
│       └── publish.yml        # CI/CD 파이프라인
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### 패키지 의존 관계

```
scripts → tokens (토큰 JSON 생성)
ui      → tokens (CSS Variables / TS 상수 소비)
docs    → ui     (Storybook에서 컴포넌트 렌더링)
```

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## Phase 1: Design Tokens

### Token 카테고리

| 카테고리   | 예시                              |
|-----------|-----------------------------------|
| Color     | primary, secondary, text, bg, error |
| Typography| fontSize, fontWeight, lineHeight  |
| Spacing   | xs(2px), sm(4px), md(8px), lg(16px), xl(24px) |
| Radius    | sm(4px), md(8px), lg(12px)        |
| Shadow    | sm, md, lg                        |

### Token 파이프라인

```
[수동 정의]
tokens/raw/tokens.json
       ↓  (scripts/sync-tokens.ts)
[자동 생성]
tokens/dist/tokens.css        → CSS Custom Properties
tokens/dist/tokens.ts         → TypeScript 상수 객체
tokens/dist/index.ts          → barrel export
```

### tokens/raw/tokens.json 예시

```json
{
  "color": {
    "primary": "#2563EB",
    "secondary": "#64748B",
    "text": "#111827",
    "textMuted": "#6B7280",
    "bg": "#FFFFFF",
    "bgMuted": "#F9FAFB",
    "error": "#DC2626",
    "success": "#16A34A"
  },
  "spacing": {
    "xs": "2px",
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "xl": "24px",
    "2xl": "32px"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "full": "9999px"
  },
  "fontSize": {
    "xs": "12px",
    "sm": "14px",
    "md": "16px",
    "lg": "18px",
    "xl": "20px",
    "2xl": "24px"
  },
  "fontWeight": {
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  }
}
```

### 생성 결과

**tokens/dist/tokens.css**
```css
:root {
  /* Color */
  --color-primary: #2563EB;
  --color-secondary: #64748B;
  --color-text: #111827;
  --color-text-muted: #6B7280;
  --color-bg: #FFFFFF;
  --color-bg-muted: #F9FAFB;
  --color-error: #DC2626;
  --color-success: #16A34A;

  /* Spacing */
  --spacing-xs: 2px;
  --spacing-sm: 4px;
  --spacing-md: 8px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Font Size */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;

  /* Font Weight */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Shadow */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

**tokens/dist/tokens.ts**
```ts
export const color = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  bg: 'var(--color-bg)',
  bgMuted: 'var(--color-bg-muted)',
  error: 'var(--color-error)',
  success: 'var(--color-success)',
} as const;

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
} as const;

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
} as const;

export const fontSize = {
  xs: 'var(--font-size-xs)',
  sm: 'var(--font-size-sm)',
  md: 'var(--font-size-md)',
  lg: 'var(--font-size-lg)',
  xl: 'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
} as const;

export const fontWeight = {
  normal: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
} as const;

export const shadow = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
} as const;
```

---

## Phase 2: 컴포넌트 라이브러리

### 스타일링 전략

**CSS Variables + CSS Modules**

- 토큰을 CSS Variables로 주입 → 컴포넌트가 `var()` 참조
- 런타임 JS 번들 0 (CSS-in-JS 대비 장점)
- Tree-shaking 친화적

### Variant → Token 연결 패턴

컴포넌트의 `variant` prop이 Design Token과 어떻게 연결되는지 명시합니다.

**방식: data-attribute 기반 스타일 분기**

```tsx
// Button.tsx
<button
  data-variant={variant}
  data-size={size}
  className={styles.button}
>
  {children}
</button>
```

```css
/* Button.module.css */
.button {
  /* 기본 스타일 */
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s;
}

/* Variant별 토큰 매핑 */
.button[data-variant="primary"] {
  background-color: var(--color-primary);
  color: var(--color-bg);
}

.button[data-variant="secondary"] {
  background-color: var(--color-bg-muted);
  color: var(--color-text);
  border: 1px solid var(--color-secondary);
}

.button[data-variant="ghost"] {
  background-color: transparent;
  color: var(--color-primary);
}

.button[data-variant="danger"] {
  background-color: var(--color-error);
  color: var(--color-bg);
}

/* Size별 토큰 매핑 */
.button[data-size="sm"] {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.button[data-size="md"] {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
}

.button[data-size="lg"] {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}
```

> **왜 data-attribute?**
> - className 조합보다 CSS 선택자가 직관적
> - TypeScript에서 variant 타입 체크 가능
> - DevTools에서 현재 상태 확인 용이

### MVP 컴포넌트 (7개)

| 컴포넌트   | 핵심 Props                           |
|-----------|--------------------------------------|
| Button    | variant, size, loading, disabled     |
| Input     | variant, size, error, placeholder    |
| Select    | options, value, onChange, disabled   |
| Badge     | variant, size                        |
| Typography| as, variant (heading/body/caption)   |
| Card      | padding, shadow                      |
| Dialog    | open, onClose, title                 |

### 컴포넌트 API 설계 원칙

```tsx
// 일관된 variant / size 인터페이스
<Button variant="primary" size="md">Save</Button>
<Input variant="outlined" size="md" error="Required" />
<Badge variant="success" size="sm">Active</Badge>
```

- **variant**: `primary | secondary | ghost | danger` 등 (컴포넌트별 확장)
- **size**: `sm | md | lg`
- 상태(loading, disabled, error)는 내부 처리 + prop 노출

### Dialog 접근성 (A11y) 전략

Dialog는 접근성 실수가 잦은 컴포넌트입니다. 다음 요구사항을 반드시 구현합니다.

| 요구사항 | 구현 방식 |
|---------|----------|
| Focus Trap | 모달 내부에 포커스 가두기 (Tab 순환) |
| ESC 닫기 | `onKeyDown`에서 Escape 키 감지 → `onClose` 호출 |
| 포커스 복원 | 닫힐 때 트리거 요소로 포커스 복원 |
| 초기 포커스 | 열릴 때 첫 번째 focusable 요소로 이동 |
| 스크린 리더 | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| 배경 클릭 | Backdrop 클릭 시 닫기 (선택적) |

**구현 예시:**

```tsx
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

// 핵심 속성
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={titleId}
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
>
```

> **팁**: Focus trap 구현이 복잡하면 `@radix-ui/react-dialog` 또는 `react-focus-lock` 라이브러리 활용을 고려하세요.

### 컴포넌트 폴더 구조

```
packages/ui/src/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   ├── Button.stories.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── Input/
│   └── ...
├── index.ts                # barrel export
└── styles/
    └── globals.css         # tokens.css import
```

### packages/ui/package.json

```json
{
  "name": "@your-npm-username/ui",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### CSS 배포 전략

사용자가 CSS를 import 해야 함:

```tsx
// 사용처에서
import '@your-npm-username/ui/styles.css';
import { Button } from '@your-npm-username/ui';
```

---

## Phase 3: CLI Scripts

### scripts/sync-tokens.ts

```ts
import fs from 'fs';
import path from 'path';

const RAW_PATH = 'packages/tokens/raw/tokens.json';
const DIST_PATH = 'packages/tokens/dist';

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function generateCSS(tokens: Record<string, Record<string, string>>): string {
  let css = ':root {\n';

  for (const [category, values] of Object.entries(tokens)) {
    css += `  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */\n`;
    for (const [key, value] of Object.entries(values)) {
      const varName = `--${toKebabCase(category)}-${toKebabCase(key)}`;
      css += `  ${varName}: ${value};\n`;
    }
    css += '\n';
  }

  css += '}\n';
  return css;
}

function generateTS(tokens: Record<string, Record<string, string>>): string {
  let ts = '';

  for (const [category, values] of Object.entries(tokens)) {
    ts += `export const ${category} = {\n`;
    for (const [key, value] of Object.entries(values)) {
      const varName = `--${toKebabCase(category)}-${toKebabCase(key)}`;
      ts += `  ${key.includes('-') ? `'${key}'` : key}: 'var(${varName})',\n`;
    }
    ts += '} as const;\n\n';
  }

  return ts;
}

// Main
const raw = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));

fs.mkdirSync(DIST_PATH, { recursive: true });
fs.writeFileSync(path.join(DIST_PATH, 'tokens.css'), generateCSS(raw));
fs.writeFileSync(path.join(DIST_PATH, 'tokens.ts'), generateTS(raw));
fs.writeFileSync(path.join(DIST_PATH, 'tokens.json'), JSON.stringify(raw, null, 2));

console.log('Tokens generated successfully!');
```

### scripts/generate-component.ts

```ts
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

const TEMPLATES_PATH = 'templates';
const UI_PATH = 'packages/ui/src';

const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: pnpm generate <ComponentName>');
  process.exit(1);
}

const templates = [
  { template: 'Component.tsx.hbs', output: `${componentName}.tsx` },
  { template: 'Component.module.css.hbs', output: `${componentName}.module.css` },
  { template: 'Component.stories.tsx.hbs', output: `${componentName}.stories.tsx` },
  { template: 'Component.test.tsx.hbs', output: `${componentName}.test.tsx` },
  { template: 'index.ts.hbs', output: 'index.ts' },
];

const componentDir = path.join(UI_PATH, componentName);
fs.mkdirSync(componentDir, { recursive: true });

for (const { template, output } of templates) {
  const templateContent = fs.readFileSync(
    path.join(TEMPLATES_PATH, template),
    'utf-8'
  );
  const compiled = Handlebars.compile(templateContent);
  const result = compiled({ name: componentName });

  fs.writeFileSync(path.join(componentDir, output), result);
}

console.log(`Component ${componentName} generated at ${componentDir}`);
```

### package.json scripts

```json
{
  "scripts": {
    "sync": "tsx scripts/sync-tokens.ts",
    "generate": "tsx scripts/generate-component.ts",
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test",
    "storybook": "pnpm --filter docs storybook"
  }
}
```

---

## Phase 4: Storybook 문서화

### 설정

- `@storybook/react-vite` (Vite 기반 빠른 빌드)
- Autodocs 활성화

### 각 컴포넌트 스토리 구성

- **Controls**: variant, size 등 인터랙티브 조작
- **Variants**: 모든 variant 한눈에 비교
- **Token Reference**: 이 컴포넌트가 사용하는 토큰 목록

### 추가 페이지

- **Token 시각화**: 색상 팔레트, 타이포 스케일, 간격 시각화
- **Getting Started**: 설치 및 사용법 가이드

---

## Phase 5: Build & Publish

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

> **빌드 순서**: `^build`는 의존 패키지가 먼저 빌드되도록 보장합니다.
> `tokens` → `ui` → `docs` 순으로 빌드됩니다.

### packages/tokens/package.json

```json
{
  "name": "@your-npm-username/tokens",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/tokens.js",
  "types": "./dist/tokens.d.ts",
  "exports": {
    ".": {
      "import": "./dist/tokens.js",
      "types": "./dist/tokens.d.ts"
    },
    "./css": "./dist/tokens.css"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsx ../../scripts/sync-tokens.ts && tsc --emitDeclarationOnly"
  }
}
```

### tsup 설정

```ts
// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  clean: true,
});
```

### npm 배포 준비

1. **npm 계정 생성**: https://www.npmjs.com/signup
2. **Access Token 발급**: npm → Account → Access Tokens → Generate
3. **GitHub Secrets 등록**: Repository → Settings → Secrets → `NPM_TOKEN`

### GitHub Actions

```yaml
# .github/workflows/publish.yml
name: Publish

on:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Changesets 설정

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

**.changeset/config.json**
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Storybook 배포 (GitHub Pages)

포트폴리오 목적이므로 Storybook을 웹에서 접근 가능하게 배포합니다.

**apps/docs/package.json에 빌드 스크립트 추가:**

```json
{
  "scripts": {
    "build": "storybook build -o dist",
    "storybook": "storybook dev -p 6006"
  }
}
```

**GitHub Actions 워크플로우 추가:**

```yaml
# .github/workflows/storybook.yml
name: Deploy Storybook

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Build Storybook
        run: pnpm --filter docs build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/docs/dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**GitHub Pages 활성화:**

1. Repository → Settings → Pages
2. Source: "GitHub Actions" 선택
3. 배포 후 `https://<username>.github.io/<repo-name>/` 에서 접근

> **대안**: Vercel이나 Netlify도 가능합니다. `apps/docs` 폴더를 루트로 지정하고 빌드 명령어를 `pnpm build && pnpm --filter docs build`로 설정하면 됩니다.

---

## 테스팅 전략

| 레벨       | 도구                       | 범위                      |
|-----------|---------------------------|---------------------------|
| Unit      | Vitest + Testing Library   | 컴포넌트 렌더링, prop 동작 |
| Type      | tsc --noEmit              | 타입 안정성                |
| Lint      | ESLint + Prettier         | 코드 품질                  |

---

## MVP 완료 체크리스트

- [ ] Monorepo 초기 설정 (pnpm + Turborepo)
- [ ] tokens.json 정의
- [ ] Token → CSS Variables + TS 상수 변환 스크립트
- [ ] 컴포넌트 템플릿 (Handlebars) 작성
- [ ] 컴포넌트 스캐폴딩 스크립트
- [ ] 7개 컴포넌트 구현 (Button, Input, Select, Badge, Typography, Card, Dialog)
- [ ] 모든 컴포넌트 Storybook 스토리
- [ ] 컴포넌트 단위 테스트
- [ ] tsup 빌드 설정
- [ ] Changesets 설정
- [ ] GitHub Actions CI/CD
- [ ] npm 첫 배포 성공
- [ ] Storybook GitHub Pages 배포
- [ ] README 작성

---

## 구현 순서

### Step 1: Monorepo 세팅
- pnpm + Turborepo 초기화
- 폴더 구조 생성
- TypeScript, ESLint, Prettier 설정

### Step 2: Token 파이프라인
- tokens.json 수동 정의
- sync-tokens.ts 스크립트 작성
- CSS/TS 변환 테스트

### Step 3: 컴포넌트 템플릿
- Handlebars 템플릿 작성
- generate-component.ts 스크립트 작성
- Button 컴포넌트 수동 구현으로 구조 확정

### Step 4: 컴포넌트 개발
- CLI로 나머지 컴포넌트 생성
- 각 컴포넌트 스타일링 및 로직 구현

### Step 5: Storybook
- Storybook 세팅
- 모든 컴포넌트 스토리 작성
- Token 시각화 페이지

### Step 6: 테스트
- Vitest 설정
- 컴포넌트 테스트 작성

### Step 7: Build & CI/CD
- tsup 빌드 설정
- Changesets 도입
- GitHub Actions 파이프라인
- npm 첫 배포

---

## 향후 확장 (MVP 이후)

- 다크/라이트 테마 지원
- Visual regression 테스트 (Chromatic)
- Figma Plugin 연동
- 컴포넌트 사용 통계
- a11y 자동 검사 (axe-core)
- Figma → React 자동 변환 (AI 활용)
