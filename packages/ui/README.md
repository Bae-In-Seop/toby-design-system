# @toby-design/components

Token-driven React 컴포넌트 라이브러리입니다.
모든 스타일이 Design Token(CSS Variables)을 참조하며, `data-attribute` 패턴으로 variant/size를 관리합니다.

## 설치

```bash
npm install @toby-design/components
```

## 사용법

```tsx
// 1. CSS import (앱 진입점에서 한 번)
import '@toby-design/components/styles.css';

// 2. 컴포넌트 사용
import { Button, Input, Badge } from '@toby-design/components';

function App() {
  return (
    <div>
      <Button variant="primary" size="md">Save</Button>
      <Input label="Email" placeholder="you@example.com" />
      <Badge variant="success">Active</Badge>
    </div>
  );
}
```

## 컴포넌트

### Button

```tsx
import { Button } from '@toby-design/components';

<Button variant="primary" size="md">Save</Button>
<Button variant="danger" loading>Deleting...</Button>
<Button variant="ghost" disabled>Cancel</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | 버튼 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| `loading` | `boolean` | `false` | 로딩 상태 (스피너 표시) |
| `disabled` | `boolean` | `false` | 비활성 상태 |

### Input

```tsx
import { Input } from '@toby-design/components';

<Input label="Name" placeholder="Enter your name" />
<Input label="Email" error="Invalid email address" />
<Input variant="filled" size="lg" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | 입력 필드 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| `label` | `string` | - | 레이블 텍스트 |
| `error` | `string` | - | 에러 메시지 (`aria-invalid` 자동 적용) |

### Select

```tsx
import { Select } from '@toby-design/components';

<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'kr', label: 'South Korea' },
    { value: 'us', label: 'United States' },
  ]}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ value: string; label: string }[]` | `[]` | 선택 옵션 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| `label` | `string` | - | 레이블 텍스트 |
| `placeholder` | `string` | - | 기본 안내 텍스트 |
| `error` | `string` | - | 에러 메시지 |

### Badge

```tsx
import { Badge } from '@toby-design/components';

<Badge variant="success">Active</Badge>
<Badge variant="error" size="lg">Failed</Badge>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'error'` | `'primary'` | 뱃지 색상 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |

### Typography

```tsx
import { Typography } from '@toby-design/components';

<Typography as="h1" variant="heading" size="lg">Title</Typography>
<Typography variant="body">Paragraph text</Typography>
<Typography variant="caption" muted>Helper text</Typography>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `'h1' \| 'h2' \| ... \| 'p' \| 'span'` | `'p'` | 렌더링 HTML 태그 |
| `variant` | `'heading' \| 'body' \| 'caption'` | `'body'` | 텍스트 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| `muted` | `boolean` | `false` | 흐린 텍스트 |

### Card

```tsx
import { Card } from '@toby-design/components';

<Card padding="md" shadow="sm">
  <h2>Card Title</h2>
  <p>Card content here</p>
</Card>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 내부 여백 |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | 그림자 |

### Dialog

```tsx
import { Dialog } from '@toby-design/components';

<Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
  <p>Are you sure?</p>
</Dialog>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | 표시 여부 |
| `onClose` | `() => void` | - | 닫기 콜백 |
| `title` | `string` | - | 타이틀 (`aria-labelledby` 연결) |

접근성: Focus Trap, ESC 닫기, 백드롭 클릭 닫기, 포커스 복원

### Checkbox

```tsx
import { Checkbox } from '@toby-design/components';

<Checkbox label="Accept terms" />
<Checkbox label="Select all" indeterminate />
<Checkbox label="Disabled" disabled />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | 레이블 텍스트 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |
| `indeterminate` | `boolean` | `false` | 부분 선택 상태 |
| `disabled` | `boolean` | `false` | 비활성 상태 |

### Toast

Context 기반 Provider + Hook 패턴입니다.

```tsx
import { ToastProvider, useToast } from '@toby-design/components';

// 앱 루트에서 Provider로 감싸기
function App() {
  return (
    <ToastProvider>
      <MyPage />
    </ToastProvider>
  );
}

// 컴포넌트에서 useToast 사용
function MyPage() {
  const { toast } = useToast();

  return (
    <button onClick={() => toast('Saved!', 'success')}>
      Save
    </button>
  );
}
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `toast` | `(message, variant?, duration?) => void` | 토스트 표시 |

| Variant | Description |
|---------|-------------|
| `'success'` | 성공 (초록) |
| `'error'` | 에러 (빨강) |
| `'warning'` | 경고 (노랑) |
| `'info'` | 정보 (파랑) |

자동 소멸 (기본 3초), 닫기 버튼, 다중 스택, slide-in/out 애니메이션

### Tabs

```tsx
import { Tabs } from '@toby-design/components';

<Tabs
  items={[
    { value: 'overview', label: 'Overview' },
    { value: 'features', label: 'Features' },
    { value: 'pricing', label: 'Pricing' },
  ]}
  defaultValue="overview"
  onChange={(value) => console.log(value)}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ value: string; label: string; disabled?: boolean }[]` | - | 탭 목록 |
| `value` | `string` | - | 제어 모드: 활성 탭 |
| `defaultValue` | `string` | 첫 번째 탭 | 비제어 모드: 초기 활성 탭 |
| `onChange` | `(value: string) => void` | - | 탭 변경 콜백 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |

접근성: 좌우 화살표 키보드 네비게이션, Home/End, `role="tablist"/"tab"/"tabpanel"`, disabled 탭 스킵

## 설계 원칙

- **Token-driven**: 모든 스타일 값은 Design Token(CSS Variables)을 참조
- **data-attribute**: variant/size를 `data-*` 속성으로 관리
- **Accessible**: 시맨틱 HTML + ARIA 속성 + 키보드 네비게이션

## Peer Dependencies

- `react` >= 18.0.0
- `react-dom` >= 18.0.0

## License

MIT
