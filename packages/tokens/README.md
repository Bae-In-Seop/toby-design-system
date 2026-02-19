# @toby-design/tokens

Figma Tokens Studio에서 추출한 Design Token 패키지입니다.
CSS Variables와 TypeScript 상수로 제공됩니다.

## 설치

```bash
npm install @toby-design/tokens
```

## 사용법

### CSS Variables

앱 진입점에서 한 번 import하면 `:root`에 모든 토큰이 등록됩니다.

```ts
// main.ts 또는 App.tsx
import '@toby-design/tokens/css';
```

이후 CSS 어디에서든 토큰을 참조할 수 있습니다.

```css
.card {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}
```

### TypeScript 상수

자동완성과 타입 안전성이 필요할 때 사용합니다.

```ts
import { spacing, fontSize, lightTheme, darkTheme } from '@toby-design/tokens';

// Primitive 토큰 - 테마 무관
spacing.md       // 'var(--spacing-md)'
fontSize.lg      // 'var(--font-size-lg)'

// Semantic 토큰 - 테마별 값
lightTheme.color.primary   // 'var(--color-primary)'
darkTheme.color.surface    // 'var(--color-surface)'
```

## 토큰 아키텍처

```
Primitive (테마 무관)     →  :root { --spacing-md: 8px; }
Semantic Light (기본)     →  :root { --color-surface: #FFFFFF; }
Semantic Dark (오버라이드) →  [data-theme="dark"] { --color-surface: #0f172a; }
```

## Primitive Tokens

테마와 무관하게 항상 동일한 값을 가집니다.

### Spacing

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| xs | `--spacing-xs` | `2px` |
| sm | `--spacing-sm` | `4px` |
| md | `--spacing-md` | `8px` |
| lg | `--spacing-lg` | `16px` |
| xl | `--spacing-xl` | `24px` |
| 2xl | `--spacing-2xl` | `32px` |
| 3xl | `--spacing-3xl` | `48px` |

### Border Radius

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| sm | `--radius-sm` | `4px` |
| md | `--radius-md` | `8px` |
| lg | `--radius-lg` | `12px` |
| full | `--radius-full` | `9999px` |

### Font Size

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| xs | `--font-size-xs` | `12px` |
| sm | `--font-size-sm` | `14px` |
| md | `--font-size-md` | `16px` |
| lg | `--font-size-lg` | `18px` |
| xl | `--font-size-xl` | `20px` |
| 2xl | `--font-size-2xl` | `24px` |

### Font Weight

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| normal | `--font-weight-normal` | `400` |
| medium | `--font-weight-medium` | `500` |
| semibold | `--font-weight-semibold` | `600` |
| bold | `--font-weight-bold` | `700` |

## Semantic Tokens

Light/Dark 테마에 따라 값이 달라지는 토큰입니다.

### Color

| 토큰 | CSS 변수 | Light | Dark |
|------|---------|-------|------|
| surface | `--color-surface` | `#FFFFFF` | `#0f172a` |
| surfaceMuted | `--color-surface-muted` | `#F9FAFB` | `#1e293b` |
| text | `--color-text` | `#111827` | `#f1f5f9` |
| textMuted | `--color-text-muted` | `#6B7280` | `#94a3b8` |
| primary | `--color-primary` | `#2563EB` | `#3b82f6` |
| primaryHover | `--color-primary-hover` | `#1D4ED8` | `#60a5fa` |
| onPrimary | `--color-on-primary` | `#FFFFFF` | `#FFFFFF` |
| secondary | `--color-secondary` | `#64748B` | `#94a3b8` |
| error | `--color-error` | `#DC2626` | `#ef4444` |
| onError | `--color-on-error` | `#FFFFFF` | `#FFFFFF` |
| success | `--color-success` | `#16A34A` | `#22c55e` |
| warning | `--color-warning` | `#F59E0B` | `#fbbf24` |
| border | `--color-border` | `#E5E7EB` | `#334155` |
| borderHover | `--color-border-hover` | `#D1D5DB` | `#475569` |
| overlay | `--color-overlay` | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` |
| focusRing | `--color-focus-ring` | `rgba(37,99,235,0.2)` | `rgba(59,130,246,0.3)` |

### Shadow

| 토큰 | CSS 변수 | Light | Dark |
|------|---------|-------|------|
| sm | `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `0 1px 2px 0 rgb(0 0 0 / 0.3)` |
| md | `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | `0 4px 6px -1px rgb(0 0 0 / 0.4)` |
| lg | `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | `0 10px 15px -3px rgb(0 0 0 / 0.4)` |

## 토큰 파이프라인

```
Figma Tokens Studio → tokens.json → sync-tokens.ts → tokens.css + tokens.ts
```

토큰 값은 Figma에서 관리되며, `sync-tokens.ts` 스크립트가 자동으로 CSS Variables와 TypeScript 상수를 생성합니다.

## License

MIT
