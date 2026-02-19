# Toby Design System - 아키텍처 가이드

Figma에서 정의한 디자인 토큰이 어떻게 코드로 변환되고,
컴포넌트가 그 토큰을 어떻게 사용하며,
최종적으로 Storybook에서 어떻게 렌더링되는지 전체 흐름을 설명합니다.

---

## 전체 흐름 요약

```
Figma Tokens Studio
       │
       │  JSON export
       ▼
packages/tokens/raw/tokens.json        ← 원본 토큰 (사람이 편집 X)
       │
       │  pnpm sync (scripts/sync-tokens.ts)
       ▼
packages/tokens/dist/
  ├── tokens.css                       ← CSS 변수 (:root { --color-primary: #2563EB; })
  ├── tokens.ts                        ← TS 상수  (color.primary → 'var(--color-primary)')
  └── tokens.json                      ← 참조용 플랫 JSON
       │
       │  import
       ▼
packages/ui/src/Button/
  ├── Button.tsx                       ← React 컴포넌트 (data-variant, data-size)
  ├── Button.module.css                ← CSS Modules (var(--color-primary) 참조)
  ├── Button.stories.tsx               ← Storybook 스토리
  └── Button.test.tsx                  ← 테스트
       │
       │  Storybook이 읽어서 렌더링
       ▼
apps/docs/
  ├── .storybook/main.ts              ← 스토리 경로 설정
  ├── .storybook/preview.ts           ← tokens.css 전역 import
  └── 브라우저에서 렌더링              ← localhost:6006
```

---

## 1. Figma → tokens.json

### Figma Tokens Studio란?

Figma 플러그인으로, 디자이너가 Figma에서 정의한 색상/간격/폰트 등의 값을
구조화된 JSON으로 내보낼 수 있게 해줍니다.

### tokens.json의 구조

```json
{
  "main": {                          ← 토큰 세트 이름
    "color": {                       ← 카테고리
      "primary": {                   ← 토큰 이름
        "$value": "#2563EB",         ← 실제 값
        "$type": "color"             ← 타입
      },
      "error": {
        "$value": "#DC2626",
        "$type": "color"
      }
    },
    "spacing": {
      "md": {
        "$value": "8",               ← 단위 없는 숫자
        "$type": "spacing"
      }
    }
  }
}
```

이 JSON이 **디자인과 코드의 유일한 연결 고리**입니다.
디자이너가 Figma에서 `primary` 색상을 `#2563EB` → `#1D4ED8`로 바꾸면,
JSON을 다시 export하고 `pnpm sync`만 실행하면 모든 컴포넌트에 자동 반영됩니다.

### 현재 정의된 토큰 (28개)

| 카테고리 | 토큰 | 예시 |
|----------|------|------|
| color | primary, error, secondary, text, textMuted, bg, bgMuted, success | `#2563EB` |
| spacing | xs, sm, md, lg | `2`, `4`, `8`, `16` |
| radius | sm, md, lg | `4`, `8`, `12` |
| fontSize | xs, sm, md, lg, xl, 2xl | `12` ~ `24` |
| fontWeight | normal, medium, semibold, bold | `400` ~ `700` |
| shadow | sm, md, lg | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |

---

## 2. sync-tokens.ts — JSON → CSS + TypeScript 변환

`pnpm sync` 명령을 실행하면 `scripts/sync-tokens.ts`가 동작합니다.

### 변환 과정

```
tokens.json 읽기
      │
      ▼
flattenTokens()  ← 중첩 JSON을 플랫하게 변환
      │
      │  { "color": { "primary": { "$value": "#2563EB" } } }
      │  →  { "color-primary": { value: "#2563EB", type: "color" } }
      │
      ├──────────────────────┐
      ▼                      ▼
generateCSS()          generateTS()
      │                      │
      ▼                      ▼
tokens.css             tokens.ts
```

### 변환 결과 — tokens.css

```css
:root {
  --color-primary: #2563EB;
  --color-error: #DC2626;
  --spacing-xs: 2px;          /* 숫자에 px 자동 추가 */
  --spacing-md: 8px;
  --radius-md: 8px;
  --font-size-md: 16px;
  --font-weight-bold: 700;    /* 단위 없는 값은 그대로 */
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  /* ... 총 28개 */
}
```

핵심: `spacing`, `borderRadius`, `fontSize` 타입은 자동으로 `px` 단위가 붙습니다.
`color`, `fontWeight`, `shadow`는 값을 그대로 유지합니다.

### 변환 결과 — tokens.ts

```ts
export const color = {
  primary: 'var(--color-primary)',
  error: 'var(--color-error)',
  // ...
} as const;

export const spacing = {
  xs: 'var(--spacing-xs)',
  md: 'var(--spacing-md)',
  // ...
} as const;

export const tokens = {
  spacing, radius, color, fontSize, fontWeight, shadow,
} as const;
```

핵심: TS 상수의 값은 **실제 색상값이 아니라 CSS 변수 참조**(`var(--...)`)입니다.
이렇게 하면 TypeScript에서 자동완성을 받으면서도, 실제 값은 CSS 변수로 관리됩니다.

### 키 이름 변환 규칙

```
JSON 경로: main.color.textMuted
  ↓ toKebabCase
CSS 변수명: --color-text-muted
  ↓ 카테고리 prefix 제거 + toCamelCase
TS 키 이름: color.textMuted
```

---

## 3. 컴포넌트가 토큰을 사용하는 방식

### CSS Modules + CSS 변수

컴포넌트는 **CSS Modules** 안에서 토큰 CSS 변수를 직접 참조합니다.

```css
/* Button.module.css */
.button[data-variant='primary'] {
  background-color: var(--color-primary);    /* ← 토큰 참조 */
  color: var(--color-bg);                    /* ← 토큰 참조 */
}

.button[data-size='md'] {
  padding: var(--spacing-sm) var(--spacing-md);  /* ← 토큰 참조 */
  font-size: var(--font-size-md);                /* ← 토큰 참조 */
}
```

하드코딩된 값(`#2563EB`, `8px`)이 단 하나도 없습니다.
모든 스타일 값은 `var(--토큰명)` 형태로 토큰을 참조합니다.

### data-attribute 패턴

일반적인 React 컴포넌트 라이브러리는 className 조합으로 variant를 관리합니다:

```tsx
// 일반적인 방식 (className 조합)
<button className={`btn btn-primary btn-md`}>

// 이 프로젝트의 방식 (data-attribute)
<button data-variant="primary" data-size="md" className={styles.button}>
```

왜 data-attribute를 쓰는가:

1. **CSS 선택자가 명확해짐**: `.button[data-variant='primary']`
2. **className 충돌 없음**: CSS Modules의 `.button` 하나만 사용
3. **DevTools에서 바로 보임**: `<button data-variant="primary">` → 어떤 상태인지 즉시 파악

### Button.tsx 코드와 CSS의 연결

```tsx
// Button.tsx
<button
  data-variant={variant}        // "primary" | "secondary" | "ghost" | "danger"
  data-size={size}              // "sm" | "md" | "lg"
  data-loading={loading || undefined}
  className={styles.button}     // CSS Modules 클래스
  disabled={disabled || loading}
>
```

```css
/* Button.module.css */
.button { /* 기본 스타일 */ }
.button[data-variant='primary'] { /* primary 색상 */ }
.button[data-variant='danger'] { /* danger 색상 */ }
.button[data-size='sm'] { /* 작은 크기 */ }
.button[data-size='lg'] { /* 큰 크기 */ }
.button:disabled { /* 비활성 상태 */ }
```

`variant="primary"` → `data-variant="primary"` → `.button[data-variant='primary']` 매칭 →
`var(--color-primary)` 적용 → `:root`의 `--color-primary: #2563EB` 값 사용

---

## 4. Storybook이 이 모든 것을 렌더링하는 방식

### 부팅 순서

```
pnpm storybook
      │
      ▼
.storybook/main.ts          ← 어떤 파일을 스토리로 읽을지 결정
      │
      │  stories: [
      │    '../src/**/*.mdx',                              ← MDX 문서
      │    '../../../packages/ui/src/**/*.stories.@(ts|tsx)' ← 컴포넌트 스토리
      │  ]
      │
      ▼
.storybook/preview.ts       ← 글로벌 설정 & CSS 로드
      │
      │  import '@toby-design/tokens/css';    ← tokens.css를 전역으로 로드
      │
      │  이 시점에서 :root에 모든 CSS 변수가 등록됨
      │  --color-primary: #2563EB;
      │  --spacing-md: 8px;
      │  --font-size-md: 16px;
      │  ... (28개)
      │
      ▼
Vite Dev Server 시작 (port 6006)
      │
      ▼
브라우저에서 Button 스토리 선택
      │
      ▼
Button.stories.tsx 실행
      │
      │  args: { variant: 'primary', size: 'md' }
      │
      ▼
Button.tsx 렌더링
      │
      │  <button data-variant="primary" data-size="md" class="button_abc123">
      │
      ▼
Button.module.css 적용
      │
      │  .button_abc123[data-variant='primary'] {
      │    background-color: var(--color-primary);   ← CSS 변수 참조
      │  }
      │
      ▼
브라우저가 CSS 변수 해석
      │
      │  var(--color-primary) → #2563EB
      │
      ▼
파란색 버튼이 화면에 렌더링됨
```

### Storybook Controls 연동

```tsx
// Button.stories.tsx
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],              // ← 자동 문서 생성
  argTypes: {
    variant: {
      control: 'select',           // ← 드롭다운 UI 생성
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' }, // ← 체크박스 UI 생성
  },
};
```

Storybook 화면 하단의 Controls 패널에서 variant를 `danger`로 변경하면:

```
Controls: variant → "danger" 선택
  → Button에 variant="danger" 전달
  → data-variant="danger" 렌더링
  → .button[data-variant='danger'] 매칭
  → background-color: var(--color-error)
  → var(--color-error) → #DC2626
  → 빨간색 버튼으로 변경
```

모든 것이 실시간으로 반응합니다.

---

## 5. 토큰 값이 바뀌면 어떤 일이 일어나는가

디자이너가 Figma에서 `primary` 색상을 `#2563EB` → `#7C3AED` (보라색)으로 변경했다고 가정합니다.

### 변경 흐름

```
1. Figma Tokens Studio에서 JSON export
   → tokens.json의 color.primary.$value가 "#7C3AED"로 변경

2. pnpm sync 실행
   → tokens.css: --color-primary: #7C3AED;
   → tokens.ts: color.primary → 'var(--color-primary)' (변화 없음, CSS 변수 참조이므로)

3. 컴포넌트 코드: 변경 없음
   → Button.module.css는 여전히 var(--color-primary)를 참조
   → Button.tsx 코드도 변경 없음

4. Storybook 재시작 or 빌드
   → 모든 primary 컴포넌트가 자동으로 보라색으로 변경됨
```

**컴포넌트 코드를 한 줄도 수정하지 않고 전체 디자인을 변경할 수 있습니다.**
이것이 "Token-driven" 설계의 핵심 장점입니다.

---

## 6. 파일 간 의존 관계 정리

```
packages/tokens/raw/tokens.json          ← 원본 (Figma에서 export)
      │
      │ sync-tokens.ts가 변환
      ▼
packages/tokens/dist/tokens.css          ← 모든 CSS 변수 정의
packages/tokens/dist/tokens.ts           ← TS 자동완성용 상수
      │
      ├─── apps/docs/.storybook/preview.ts가 tokens.css를 import
      │         → Storybook 전역에 CSS 변수 등록
      │
      └─── packages/ui/src/*/가 tokens.css의 변수를 참조
                │
                ├── Button.module.css    → var(--color-primary) 등 사용
                ├── Input.module.css     → var(--color-error) 등 사용
                ├── Card.module.css      → var(--shadow-md) 등 사용
                └── ...
```

### 패키지 의존 관계

```
@toby-design/tokens               ← 토큰만 (CSS + TS)
      ▲
      │ dependencies
      │
@toby-design/components           ← 컴포넌트 (tokens에 의존)
      ▲
      │ dependencies
      │
docs (Storybook)                  ← 문서 (tokens + components에 의존)
```

---

## 7. 컴포넌트별 토큰 사용 매핑

| 컴포넌트 | 사용하는 토큰 |
|----------|--------------|
| **Button** | color (primary, secondary, error, bg, bgMuted), spacing (xs~lg), fontSize (sm~lg), fontWeight (medium), radius (md) |
| **Input** | color (text, error, secondary, bg, bgMuted), spacing (xs~md), fontSize (sm~lg), radius (md) |
| **Select** | color (text, error, secondary, bg), spacing (xs~md), fontSize (sm~lg), radius (md) |
| **Badge** | color (primary, secondary, success, error, bg), spacing (xs~sm), fontSize (xs~md), radius (full) |
| **Typography** | color (text, textMuted), fontSize (xs~2xl), fontWeight (normal~bold) |
| **Card** | color (bg), spacing (sm~lg), radius (md~lg), shadow (sm~lg) |
| **Dialog** | color (text, bg), spacing (md~lg), fontSize (lg), fontWeight (semibold), radius (lg), shadow (lg) |

---

## 요약: 왜 이렇게 설계했는가

| 설계 결정 | 이유 |
|-----------|------|
| **CSS 변수로 토큰 관리** | 런타임에 값 변경 가능 (다크모드 등 확장성), 컴포넌트 코드 수정 없이 디자인 변경 |
| **data-attribute 패턴** | className 충돌 방지, CSS 선택자 가독성, DevTools 디버깅 편의 |
| **CSS Modules** | 스타일 스코프 격리, 전역 오염 방지, 빌드 타임 최적화 |
| **sync-tokens.ts 자동 변환** | 수동 작업 제거, Figma ↔ 코드 동기화 보장, 휴먼 에러 방지 |
| **TS 상수는 var() 참조** | 타입 안전성 + CSS 변수의 유연성을 동시에 확보 |
