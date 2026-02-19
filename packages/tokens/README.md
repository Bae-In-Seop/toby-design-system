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
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-md);
}
```

### TypeScript 상수

자동완성과 타입 안전성이 필요할 때 사용합니다.

```ts
import { color, spacing, fontSize } from '@toby-design/tokens';

// 값은 CSS 변수 참조 문자열입니다
color.primary    // 'var(--color-primary)'
spacing.md       // 'var(--spacing-md)'
fontSize.lg      // 'var(--font-size-lg)'
```

## 토큰 목록

### Color

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| primary | `--color-primary` | `#2563EB` |
| secondary | `--color-secondary` | `#64748B` |
| error | `--color-error` | `#DC2626` |
| success | `--color-success` | `#16A34A` |
| text | `--color-text` | `#111827` |
| textMuted | `--color-text-muted` | `#6B7280` |
| bg | `--color-bg` | `#FFFFFF` |
| bgMuted | `--color-bg-muted` | `#F9FAFB` |

### Spacing

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| xs | `--spacing-xs` | `2px` |
| sm | `--spacing-sm` | `4px` |
| md | `--spacing-md` | `8px` |
| lg | `--spacing-lg` | `16px` |

### Border Radius

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| sm | `--radius-sm` | `4px` |
| md | `--radius-md` | `8px` |
| lg | `--radius-lg` | `12px` |

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

### Shadow

| 토큰 | CSS 변수 | 값 |
|------|---------|-----|
| sm | `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| md | `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` |
| lg | `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` |

## 토큰 파이프라인

```
Figma Tokens Studio → tokens.json → sync-tokens.ts → tokens.css + tokens.ts
```

토큰 값은 Figma에서 관리되며, `sync-tokens.ts` 스크립트가 자동으로 CSS Variables와 TypeScript 상수를 생성합니다.

## License

MIT
