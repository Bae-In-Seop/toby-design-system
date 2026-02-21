# CLAUDE.md — Toby Design System 컴포넌트 설계 규칙

이 문서는 새로운 컴포넌트를 추가할 때 반드시 따라야 하는 규칙입니다.
기존 컴포넌트(Button, Dialog, Toast 등)에서 추출한 패턴을 기반으로 합니다.

---

## 1. 파일 구조

컴포넌트 하나당 아래 5개 파일을 생성합니다.

```
packages/ui/src/{ComponentName}/
├── {ComponentName}.tsx            ← 컴포넌트 본체
├── {ComponentName}.module.css     ← 스타일 (CSS Modules)
├── {ComponentName}.stories.tsx    ← Storybook 스토리
├── {ComponentName}.test.tsx       ← 테스트
└── index.ts                       ← re-export
```

생성 후 반드시 `packages/ui/src/index.ts`에 export를 추가합니다:

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

---

## 2. 컴포넌트 (.tsx)

### 2-1. Props 인터페이스

```tsx
// 반드시 export하여 외부에서 타입을 가져다 쓸 수 있게 합니다.
export interface ComponentNameProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | '...';  // union literal 사용
  size?: 'sm' | 'md' | 'lg';
}
```

- HTML 네이티브 속성을 확장할 때는 `extends React.HTMLAttributes<HTMLElement>`
- 네이티브 속성과 충돌하는 prop이 있으면 `Omit`으로 제거 후 확장
  - 예: `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>`

### 2-2. 컴포넌트 선언

```tsx
export const ComponentName: React.FC<ComponentNameProps> = ({
  children,
  variant = 'primary',   // 기본값은 구조 분해에서 지정
  size = 'md',
  ...props               // 나머지 네이티브 속성 전달
}) => {
  return (
    <div
      data-variant={variant}
      data-size={size}
      className={styles.componentName}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 2-3. data-attribute 패턴

variant, size, 상태(loading, disabled, active 등)는 **className이 아닌 data-attribute**로 전달합니다.

```tsx
// O — 이 프로젝트의 방식
<button data-variant={variant} data-size={size} className={styles.button}>

// X — className 조합 방식은 사용하지 않습니다
<button className={`btn btn-${variant} btn-${size}`}>
```

boolean 상태는 falsy일 때 `undefined`로 처리하여 DOM에 남지 않게 합니다:

```tsx
data-loading={loading || undefined}
data-disabled={disabled || undefined}
data-active={isActive || undefined}
```

### 2-4. Controlled / Uncontrolled 지원

Tabs처럼 사용자가 상태를 직접 관리할 수도, 컴포넌트 내부에 맡길 수도 있어야 하는 경우:

```tsx
export interface TabsProps {
  value?: string;           // controlled — 외부에서 값 주입
  defaultValue?: string;    // uncontrolled — 내부 초기값
  onChange?: (value: string) => void;
}

const [internalValue, setInternalValue] = useState(defaultValue || '');
const activeValue = controlledValue ?? internalValue;  // controlled 우선
```

### 2-5. 접근성 (a11y)

WAI-ARIA 패턴을 따릅니다. 각 컴포넌트에 맞는 role과 aria-* 속성을 적용합니다.

| 컴포넌트 | 필수 접근성 |
|----------|------------|
| Dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, ESC 닫기 |
| Tabs | `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls`, 방향키 네비게이션 |
| Toast | `role="alert"`, `aria-live="polite"` (컨테이너) |
| Checkbox | `aria-checked`, label 연결 (`htmlFor`) |
| 닫기 버튼 | `aria-label="Close"` 또는 `aria-label="Close dialog"` |

새 컴포넌트 추가 시 해당 WAI-ARIA Authoring Practices를 확인하고 적용합니다.

---

## 3. 스타일 (.module.css)

### 3-1. 토큰만 사용

**하드코딩 금지.** 모든 스타일 값은 CSS 변수(토큰)를 참조합니다.

```css
/* O */
background-color: var(--color-primary);
padding: var(--spacing-sm) var(--spacing-md);
border-radius: var(--radius-md);
transition: all var(--transition-normal);

/* X — 하드코딩 금지 */
background-color: #2563EB;
padding: 4px 8px;
border-radius: 8px;
transition: all 0.2s;
```

### 3-2. 사용 가능한 토큰 목록

**Primitive (테마 무관):**

| 카테고리 | 토큰 |
|----------|------|
| spacing | `--spacing-xs(2)` `--spacing-sm(4)` `--spacing-md(8)` `--spacing-lg(16)` `--spacing-xl(24)` `--spacing-2xl(32)` `--spacing-3xl(48)` |
| radius | `--radius-sm(4)` `--radius-md(8)` `--radius-lg(12)` `--radius-full(9999)` |
| fontSize | `--font-size-xs(12)` `--font-size-sm(14)` `--font-size-md(16)` `--font-size-lg(18)` `--font-size-xl(20)` `--font-size-2xl(24)` |
| fontWeight | `--font-weight-normal(400)` `--font-weight-medium(500)` `--font-weight-semibold(600)` `--font-weight-bold(700)` |
| lineHeight | `--line-height-tight(1.25)` `--line-height-normal(1.5)` `--line-height-relaxed(1.75)` |
| transition | `--transition-fast(150ms)` `--transition-normal(200ms)` `--transition-slow(300ms)` |
| zIndex | `--z-index-dropdown(100)` `--z-index-toast(9999)` `--z-index-modal(10000)` |

**Semantic (라이트/다크 자동 전환):**

| 카테고리 | 토큰 |
|----------|------|
| color | `--color-surface` `--color-surface-muted` `--color-text` `--color-text-muted` `--color-primary` `--color-primary-hover` `--color-on-primary` `--color-secondary` `--color-error` `--color-error-hover` `--color-on-error` `--color-success` `--color-success-hover` `--color-warning` `--color-border` `--color-border-hover` `--color-overlay` `--color-focus-ring` `--color-focus-ring-error` |
| shadow | `--shadow-sm` `--shadow-md` `--shadow-lg` |

### 3-3. data-attribute 선택자 패턴

```css
.component { /* 기본 스타일 */ }

/* Variants */
.component[data-variant='primary'] { ... }
.component[data-variant='secondary'] { ... }

/* Sizes */
.component[data-size='sm'] { ... }
.component[data-size='md'] { ... }
.component[data-size='lg'] { ... }

/* States */
.component:hover:not(:disabled) { ... }
.component:disabled { opacity: 0.5; cursor: not-allowed; }
.component[data-active] { ... }
```

### 3-4. 스타일 기본 원칙

- `font-family: inherit` — 상위에서 상속받게 합니다
- `transition: all var(--transition-normal)` — 인터랙션에 부드러운 전환을 줍니다
- hover 상태는 `:hover:not(:disabled)`로 disabled 시 hover 방지합니다
- z-index는 토큰을 사용합니다 (`var(--z-index-dropdown)` 등)

---

## 4. Storybook (.stories.tsx)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],            // 자동 문서 생성
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// 기본 스토리 — args 기반
export const Default: Story = {
  args: {
    children: 'ComponentName',
    variant: 'primary',
    size: 'md',
  },
};

// 인터랙티브 스토리 — 상태가 필요한 경우 render 사용
export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState(false);
    return <ComponentName open={state} onClose={() => setState(false)} />;
  },
};
```

- 모든 스토리에 `tags: ['autodocs']`를 포함합니다.
- `@storybook/react-vite`에서 Meta, StoryObj를 import합니다.
- argTypes의 control은 prop 타입에 맞게 설정합니다 (`select`, `boolean`, `text`, `number`).

---

## 5. 테스트 (.test.tsx)

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // 1. 기본 렌더링
  it('renders correctly', () => { ... });

  // 2. Props 반영
  it('applies default variant and size', () => { ... });
  it('applies custom variant and size', () => { ... });

  // 3. 인터랙션 (해당되는 경우)
  it('calls onChange when clicked', () => { ... });
  it('calls onClose when ESC is pressed', () => { ... });

  // 4. 접근성 (해당되는 경우)
  it('has correct aria attributes', () => { ... });

  // 5. 상태 (해당되는 경우)
  it('renders nothing when closed', () => { ... });
  it('shows loading state', () => { ... });
});
```

- `vitest` + `@testing-library/react` 사용
- 콜백 mock은 `vi.fn()` 사용
- 기본 렌더링, Props 반영, 인터랙션, 접근성 순서로 작성

---

## 6. index.ts (re-export)

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

필요한 타입, 하위 컴포넌트, 훅이 있다면 함께 export합니다:

```ts
// Toast처럼 Provider/Hook이 있는 경우
export { Toast, ToastProvider, useToast } from './Toast';
export type { ToastProps, ToastItem, ToastVariant } from './Toast';
```

---

## 7. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 폴더/파일명 | PascalCase | `Accordion/Accordion.tsx` |
| 컴포넌트 | PascalCase | `export const Accordion` |
| Props 인터페이스 | `{Name}Props` | `AccordionProps` |
| CSS 클래스 | camelCase | `.accordion`, `.accordionItem` |
| data-attribute | kebab-case 값 | `data-variant="primary"` |
| 토큰 CSS 변수 | kebab-case | `var(--color-primary)` |

---

## 8. 체크리스트 — 새 컴포넌트 추가 시

- [ ] `packages/ui/src/{Name}/` 에 5개 파일 생성
- [ ] Props 인터페이스 export
- [ ] data-attribute 패턴으로 variant/size/상태 관리
- [ ] 스타일에 하드코딩 값 없이 토큰만 사용
- [ ] 접근성: role, aria-*, 키보드 인터랙션 적용
- [ ] Storybook 스토리에 `tags: ['autodocs']` 포함
- [ ] 테스트: 렌더링, props, 인터랙션, 접근성 커버
- [ ] `packages/ui/src/index.ts`에 export 추가
- [ ] `pnpm test` 통과 확인
