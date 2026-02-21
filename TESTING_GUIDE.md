# React Testing Library 학습 가이드

이 문서는 Toby Design System의 실제 테스트 코드를 기반으로 작성된 학습 자료입니다.
react-testing-library를 처음 접하는 사람을 위해, 개념부터 실전 패턴까지 단계별로 설명합니다.

---

## 목차

1. [테스트 환경 이해하기](#1-테스트-환경-이해하기)
2. [기본 패턴: render → 조회 → 검증](#2-기본-패턴-render--조회--검증)
3. [DOM 요소 조회 방법](#3-dom-요소-조회-방법)
4. [data-attribute 검증](#4-data-attribute-검증)
5. [사용자 인터랙션 테스트](#5-사용자-인터랙션-테스트)
6. [Mock 함수 (vi.fn)](#6-mock-함수-vifn)
7. [타이머 테스트 (Fake Timers)](#7-타이머-테스트-fake-timers)
8. [Controlled vs Uncontrolled 테스트](#8-controlled-vs-uncontrolled-테스트)
9. [rerender로 props 변경 테스트](#9-rerender로-props-변경-테스트)
10. [접근성(ARIA) 테스트](#10-접근성aria-테스트)
11. [테스트 작성 순서](#11-테스트-작성-순서)
12. [자주 쓰이는 패턴 요약](#12-자주-쓰이는-패턴-요약)

---

## 1. 테스트 환경 이해하기

이 프로젝트는 두 가지 도구를 조합해서 사용합니다:

| 도구 | 역할 |
|------|------|
| **vitest** | 테스트 러너 — 테스트 파일을 찾아 실행하고, 성공/실패를 보고 |
| **@testing-library/react** | React 컴포넌트를 가상 DOM(jsdom)에 렌더링하고 조회 |
| **@testing-library/user-event** | 클릭, 키보드, 호버 등 사용자 행동을 시뮬레이션 |

### import 구조

테스트 파일 상단의 import를 보면 각 도구의 역할이 나뉩니다:

```tsx
// vitest — 테스트 구조와 검증 도구
import { describe, it, expect, vi } from 'vitest';
//       ┃         ┃   ┃       ┗ mock 함수 등 유틸리티
//       ┃         ┃   ┗ 기대값 검증 (assertion)
//       ┃         ┗ 하나의 테스트 케이스 정의
//       ┗ 테스트 그룹 정의

// @testing-library/react — 렌더링과 DOM 조회
import { render, screen, fireEvent, act } from '@testing-library/react';
//       ┃        ┃       ┃           ┗ React 상태 업데이트를 명시적으로 감싸기
//       ┃        ┃       ┗ 단순 이벤트 발생 (클릭, 키다운 등)
//       ┃        ┗ 렌더링된 DOM을 조회하는 전역 객체
//       ┗ 컴포넌트를 가상 DOM에 렌더링

// @testing-library/user-event — 실제 사용자처럼 인터랙션
import userEvent from '@testing-library/user-event';
```

### describe / it 구조

```tsx
describe('Switch', () => {           // 'Switch'라는 테스트 그룹
  it('renders with label', () => {   // 그 안의 개별 테스트
    // ...
  });

  it('toggles on click', async () => {  // async: 비동기 동작이 포함된 테스트
    // ...
  });
});
```

- `describe` — 관련 테스트들을 하나의 그룹으로 묶습니다
- `it` — 하나의 구체적인 동작을 검증합니다. "it does X" 형태로 읽힙니다

---

## 2. 기본 패턴: render → 조회 → 검증

모든 테스트는 이 3단계를 따릅니다.

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('renders with label', () => {
  // 1단계: 컴포넌트를 가상 DOM에 렌더링
  render(<Switch label="Notifications" />);

  // 2단계: DOM에서 요소를 조회
  const input = screen.getByLabelText('Notifications');

  // 3단계: 기대값 검증
  expect(input).toBeDefined();
});
```

각 단계가 하는 일:

- **`render(<Switch .../>)`** — 실제 브라우저 없이 jsdom이라는 가상 환경에서 컴포넌트를 렌더링합니다. HTML 노드가 메모리에 생성됩니다.

- **`screen.getByLabelText('Notifications')`** — 렌더링된 DOM에서 "Notifications" 라벨과 연결된 input을 찾습니다. 마치 스크린리더가 요소를 찾는 것과 같은 방식입니다.

- **`expect(input).toBeDefined()`** — 그 요소가 존재하는지 확인합니다. 존재하지 않으면 테스트 실패.

### render()의 반환값

```tsx
const { container, rerender } = render(<Switch label="Test" />);

// container — 최상위 DOM 노드. querySelector 등으로 직접 탐색 가능
container.firstChild          // 컴포넌트의 루트 요소
container.querySelector('input')  // CSS 선택자로 검색

// rerender — 같은 컴포넌트를 새 props로 다시 렌더링
rerender(<Switch label="Test" checked={true} onChange={() => {}} />);
```

---

## 3. DOM 요소 조회 방법

testing-library는 **"사용자가 보는 것"** 기준으로 요소를 찾습니다.
CSS 클래스명이나 컴포넌트 내부 구현이 아니라, 사용자가 인식하는 방식으로 조회합니다.

### 조회 우선순위 (권장 → 비권장)

```
getByRole > getByLabelText > getByText > getByTestId > querySelector
```

앞쪽일수록 접근성을 자연스럽게 검증하므로 권장됩니다.

### 3-1. `getByRole` — 접근성 역할로 찾기 (가장 권장)

HTML 요소에는 암묵적인 role이 있습니다. `<button>` → `role="button"`, `<input type="checkbox">` → `role="checkbox"` 등.

```tsx
// Switch — role="switch"를 명시적으로 부여한 input 찾기
screen.getByRole('switch');

// Accordion — 모든 button 요소를 배열로
screen.getAllByRole('button');

// Accordion — region 역할의 패널들
screen.getAllByRole('region');

// name 옵션으로 특정 버튼 찾기
screen.getByRole('button', { name: 'Submit' });
```

> `getByRole`은 스크린리더가 요소를 인식하는 방식과 동일합니다.
> 이 조회가 성공한다는 것 자체가 접근성이 올바르다는 증거입니다.

### 3-2. `getByLabelText` — 라벨로 input 찾기

```tsx
// Switch: <label htmlFor="id">Notifications</label> + <input id="id">
screen.getByLabelText('Notifications');  // → <input> 반환
```

`<label>`과 `<input>`이 올바르게 연결(`htmlFor` ↔ `id`)되어 있어야 찾을 수 있습니다.
라벨 연결이 깨져 있으면 테스트가 자동으로 실패합니다.

### 3-3. `getByText` — 화면에 보이는 텍스트로 찾기

```tsx
// Accordion — 트리거 버튼 안의 텍스트
screen.getByText('Item 1');        // 정확히 'Item 1'인 요소
screen.getByText(/item/i);         // 정규식도 가능 (대소문자 무시)
```

### 3-4. `querySelector` — CSS 선택자로 직접 찾기 (최후의 수단)

```tsx
const { container } = render(<Switch aria-label="Toggle" />);
container.querySelector('input[role="switch"]');
```

라벨이 없거나 role 기반 조회가 불가능한 경우에만 사용합니다.

### getBy vs getAllBy vs queryBy

| 접두사 | 결과 없을 때 | 반환 |
|--------|-------------|------|
| `getBy` | **에러 throw** | 단일 요소 |
| `getAllBy` | **에러 throw** | 요소 배열 |
| `queryBy` | `null` 반환 | 단일 요소 또는 null |

```tsx
// 요소가 "없어야" 하는 경우 queryBy 사용
expect(screen.queryByText('Error')).toBeNull();
```

---

## 4. data-attribute 검증

이 프로젝트는 variant, size, 상태값을 `data-*` 속성으로 관리합니다.

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('applies default size md', () => {
  const { container } = render(<Switch label="Test" />);
  const wrapper = container.firstChild as HTMLElement;
  expect(wrapper.dataset.size).toBe('md');
});
```

DOM에서 `data-size="md"`는 JavaScript에서 `element.dataset.size === 'md'`로 접근합니다.

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('applies data-disabled on wrapper', () => {
  const { container } = render(<Switch label="Disabled" disabled />);
  const wrapper = container.firstChild as HTMLElement;
  expect(wrapper.dataset.disabled).toBe('true');
});
```

### boolean data-attribute 패턴

컴포넌트에서 `data-disabled={disabled || undefined}`로 처리하면:
- `disabled={true}` → DOM에 `data-disabled="true"` 존재 → `dataset.disabled === 'true'`
- `disabled={false}` → DOM에 속성 없음 → `dataset.disabled === undefined`

```tsx
// 속성이 있는지
expect(wrapper.dataset.disabled).toBe('true');

// 속성이 없는지
expect(wrapper.dataset.disabled).toBeUndefined();
```

---

## 5. 사용자 인터랙션 테스트

### fireEvent vs userEvent

| | fireEvent | userEvent |
|---|---|---|
| 동작 | 단일 이벤트 하나만 발생 | 실제 사용자처럼 연쇄 이벤트 발생 |
| 예시 | `fireEvent.click(el)` → click만 | `userEvent.click(el)` → pointerdown → mousedown → pointerup → mouseup → click |
| 사용 시점 | 단순하고 직접적인 이벤트 | 일반적인 인터랙션 테스트 |

이 프로젝트에서는 **userEvent를 기본으로** 사용하고, 타이머와 충돌하는 경우에만 fireEvent를 씁니다.

### 5-1. 클릭

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('toggles on click', async () => {
  const onChange = vi.fn();
  render(<Switch label="Toggle me" onChange={onChange} />);

  const input = screen.getByRole('switch');
  await userEvent.click(input);          // async/await 필수

  expect(onChange).toHaveBeenCalledTimes(1);
  expect((input as HTMLInputElement).checked).toBe(true);
});
```

### 5-2. 키보드 입력

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('moves focus with ArrowDown', async () => {
  render(<Accordion items={defaultItems} />);
  const triggers = screen.getAllByRole('button');

  triggers[0].focus();                        // 첫 번째 버튼에 포커스
  await userEvent.keyboard('{ArrowDown}');    // 아래 화살표 누름

  expect(document.activeElement).toBe(triggers[1]);  // 포커스 이동 확인
});
```

자주 쓰는 키 문법:

```
'{ArrowDown}'  '{ArrowUp}'  '{ArrowLeft}'  '{ArrowRight}'
'{Home}'       '{End}'      '{Escape}'     '{Enter}'
'{Tab}'        '{Space}'
```

### 5-3. 호버 (마우스 올리기/내리기)

> 실제 파일: `src/Tooltip/Tooltip.test.tsx`

```tsx
it('shows tooltip on hover after delay', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <Tooltip content="Tip" showDelay={200}>
      <button type="button">Trigger</button>
    </Tooltip>
  );

  await user.hover(screen.getByText('Trigger'));   // 마우스 올림
  act(() => { vi.advanceTimersByTime(200); });      // 시간 경과

  expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
});
```

### 5-4. 탭 (포커스 이동)

> 실제 파일: `src/Tooltip/Tooltip.test.tsx`

```tsx
it('shows tooltip on focus', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <Tooltip content="Tip" showDelay={10}>
      <button type="button">Trigger</button>
    </Tooltip>
  );

  await user.tab();                        // Tab 키로 포커스 이동
  act(() => { vi.advanceTimersByTime(10); });

  expect(screen.getByRole('tooltip').dataset.visible).toBe('true');
});
```

### 5-5. fireEvent 직접 사용 (특수한 경우)

타이머와 userEvent가 충돌하는 경우, fireEvent로 직접 이벤트를 발생시킵니다:

> 실제 파일: `src/Tooltip/Tooltip.test.tsx`

```tsx
it('hides tooltip on mouse leave', async () => {
  // ... 호버로 보이게 한 후 ...
  fireEvent.mouseLeave(screen.getByText('Trigger'));  // 직접 이벤트
  expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
});

it('hides tooltip on Escape key', async () => {
  // ... 보이게 한 후 ...
  fireEvent.keyDown(document, { key: 'Escape' });    // document 레벨 이벤트
  expect(screen.getByRole('tooltip').dataset.visible).toBeUndefined();
});
```

---

## 6. Mock 함수 (vi.fn)

`vi.fn()`은 **"호출 기록을 추적하는 가짜 함수"** 를 만듭니다.
콜백 prop(`onChange`, `onClose` 등)이 올바르게 호출되는지 검증할 때 사용합니다.

### 기본 사용법

```tsx
const onChange = vi.fn();    // 빈 함수이지만 호출을 기록

onChange('hello');
onChange('hello', 'world');
onChange(42);

// 호출 횟수 검증
expect(onChange).toHaveBeenCalledTimes(3);

// 특정 인자로 호출되었는지
expect(onChange).toHaveBeenCalledWith('hello');
expect(onChange).toHaveBeenCalledWith(42);
```

### 실전 예시 — 콜백 검증

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('calls onChange with new value in controlled mode', async () => {
  const onChange = vi.fn();                              // 1. mock 생성
  render(
    <Accordion
      items={defaultItems}
      value="item-1"
      onChange={onChange}                                 // 2. prop으로 전달
    />
  );
  await userEvent.click(screen.getByText('Item 2'));     // 3. 사용자 행동

  expect(onChange).toHaveBeenCalledWith('item-2');        // 4. 올바른 값으로 호출됐는지
});
```

### 주요 matcher들

```tsx
expect(fn).toHaveBeenCalled();              // 1번 이상 호출됨
expect(fn).toHaveBeenCalledTimes(2);        // 정확히 2번 호출됨
expect(fn).toHaveBeenCalledWith('a', 'b');  // 이 인자들로 호출된 적 있음
expect(fn).not.toHaveBeenCalled();          // 한 번도 호출 안 됨
```

---

## 7. 타이머 테스트 (Fake Timers)

`setTimeout`, `setInterval`을 사용하는 컴포넌트(Tooltip의 showDelay 등)를 테스트할 때,
실제로 시간이 흐르길 기다리면 테스트가 느려집니다.
**Fake Timer**는 시간의 흐름을 프로그래머가 제어하게 해줍니다.

### 설정

```tsx
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // 이제 setTimeout, setInterval은 가짜 타이머를 사용
  // shouldAdvanceTime: true → Promise 등 비동기는 정상 동작
});

afterEach(() => {
  vi.useRealTimers();  // 테스트 끝나면 원래 타이머로 복원
});
```

### 시간 제어

```tsx
// 컴포넌트 안: setTimeout(() => setVisible(true), 200)

vi.advanceTimersByTime(100);   // 100ms 흐른 것으로 처리 → 아직 안 보임
vi.advanceTimersByTime(100);   // 총 200ms → setTimeout 콜백 실행됨!
```

### act()로 감싸는 이유

React는 상태 변경(setState) 후 리렌더링을 합니다.
테스트에서 타이머를 진행시켜 상태가 바뀌면, React에게 "리렌더링해라"고 알려줘야 합니다:

```tsx
// O — act로 감싸서 React가 리렌더링하도록
act(() => {
  vi.advanceTimersByTime(200);
});
// 이 시점에서 DOM이 업데이트됨
expect(screen.getByRole('tooltip').dataset.visible).toBe('true');

// X — act 없이 하면 DOM이 아직 업데이트 안 됐을 수 있음
vi.advanceTimersByTime(200);
// ⚠ 이 시점에서 DOM이 아직 이전 상태일 수 있음
```

### userEvent + Fake Timer 조합

userEvent도 내부적으로 타이머를 사용하므로, fake timer 환경에서는 설정이 필요합니다:

```tsx
const user = userEvent.setup({
  advanceTimers: vi.advanceTimersByTime,  // userEvent의 내부 타이머도 가짜로
});

await user.hover(element);   // 이제 fake timer 환경에서도 정상 동작
```

---

## 8. Controlled vs Uncontrolled 테스트

React에서 form 요소는 두 가지 방식으로 관리할 수 있습니다:

- **Uncontrolled** — 컴포넌트 내부 state로 관리 (`defaultValue` 사용)
- **Controlled** — 외부에서 값을 주입 (`value` + `onChange` 사용)

### Uncontrolled 테스트

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('toggles item on click', async () => {
  // value prop 없이 → 내부 state로 관리
  render(<Accordion items={defaultItems} />);

  const trigger = screen.getByText('Item 1');
  await userEvent.click(trigger);

  // 클릭하면 내부 state가 바뀌어 DOM이 실제로 변함
  expect(
    trigger.closest('button')!.getAttribute('aria-expanded')
  ).toBe('true');
});
```

### Controlled 테스트

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('respects controlled value', () => {
  // value="item-2"로 고정 → 이 값만 열림
  render(<Accordion items={defaultItems} value="item-2" />);

  const trigger1 = screen.getByText('Item 1').closest('button')!;
  const trigger2 = screen.getByText('Item 2').closest('button')!;

  expect(trigger1.getAttribute('aria-expanded')).toBe('false');
  expect(trigger2.getAttribute('aria-expanded')).toBe('true');
});

it('calls onChange with new value in controlled mode', async () => {
  const onChange = vi.fn();
  render(
    <Accordion items={defaultItems} value="item-1" onChange={onChange} />
  );

  await userEvent.click(screen.getByText('Item 2'));

  // controlled 모드에서는 onChange가 호출되었는지만 확인
  // (실제 DOM 변경은 부모가 value를 바꿔야 발생)
  expect(onChange).toHaveBeenCalledWith('item-2');
});
```

### Switch — native input의 controlled/uncontrolled

> 실제 파일: `src/Switch/Switch.test.tsx`

Switch는 `<input type="checkbox">`를 감싸고 있어서 HTML의 `checked`/`defaultChecked`를 그대로 활용합니다:

```tsx
// Uncontrolled — defaultChecked 사용
it('supports uncontrolled defaultChecked', () => {
  render(<Switch label="Unctrl" defaultChecked />);
  const input = screen.getByRole('switch') as HTMLInputElement;
  expect(input.checked).toBe(true);
});

// Controlled — checked + onChange 사용
it('supports controlled checked state', () => {
  const { rerender } = render(
    <Switch label="Ctrl" checked={false} onChange={() => {}} />
  );
  const input = screen.getByRole('switch') as HTMLInputElement;
  expect(input.checked).toBe(false);

  rerender(<Switch label="Ctrl" checked={true} onChange={() => {}} />);
  expect(input.checked).toBe(true);
});
```

---

## 9. rerender로 props 변경 테스트

`rerender()`는 같은 위치에서 컴포넌트를 새 props로 다시 렌더링합니다.
부모 컴포넌트가 state를 바꿔서 자식에게 새 props를 내려주는 상황을 재현합니다.

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('supports controlled checked state', () => {
  // 처음: checked={false}
  const { rerender } = render(
    <Switch label="Ctrl" checked={false} onChange={() => {}} />
  );
  const input = screen.getByRole('switch') as HTMLInputElement;
  expect(input.checked).toBe(false);

  // 부모가 state를 바꿔서 checked={true}를 내려줌
  rerender(
    <Switch label="Ctrl" checked={true} onChange={() => {}} />
  );

  // 같은 input 요소가 업데이트됨 (새로 생성되지 않음)
  expect(input.checked).toBe(true);
});
```

> **주의:** `rerender()`는 완전히 새 컴포넌트를 만드는 게 아니라,
> 기존 컴포넌트의 props만 바꿉니다. React의 reconciliation이 정상 동작합니다.

---

## 10. 접근성(ARIA) 테스트

testing-library의 role 기반 조회를 사용하면 접근성을 자연스럽게 검증할 수 있습니다.
추가로 ARIA 속성값을 직접 확인하는 테스트도 작성합니다.

### aria-expanded (열림/닫힘 상태)

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('has correct aria-expanded attributes', () => {
  render(<Accordion items={defaultItems} defaultValue="item-2" />);

  const trigger1 = screen.getByText('Item 1').closest('button')!;
  const trigger2 = screen.getByText('Item 2').closest('button')!;

  // aria-expanded는 문자열 "true"/"false"
  expect(trigger1.getAttribute('aria-expanded')).toBe('false');
  expect(trigger2.getAttribute('aria-expanded')).toBe('true');
});
```

### aria-controls / aria-labelledby (요소 간 연결)

> 실제 파일: `src/Accordion/Accordion.test.tsx`

```tsx
it('has correct aria-controls linking', () => {
  render(<Accordion items={defaultItems} />);

  const trigger = screen.getByText('Item 1').closest('button')!;
  const panelId = trigger.getAttribute('aria-controls');

  // 1. aria-controls 값이 예상대로인지
  expect(panelId).toBe('accordion-panel-item-1');

  // 2. 그 id를 가진 요소가 실제로 DOM에 존재하는지
  expect(document.getElementById(panelId!)).toBeDefined();
});

it('panels have role region and aria-labelledby', () => {
  render(<Accordion items={defaultItems} />);

  const regions = screen.getAllByRole('region');
  expect(regions.length).toBe(3);

  // 패널이 트리거를 참조하는지
  expect(regions[0].getAttribute('aria-labelledby')).toBe(
    'accordion-trigger-item-1'
  );
});
```

### aria-describedby (설명 연결)

> 실제 파일: `src/Tooltip/Tooltip.test.tsx`

```tsx
it('sets aria-describedby when visible', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(
    <Tooltip content="Tip" showDelay={10}>
      <button type="button">Trigger</button>
    </Tooltip>
  );

  const trigger = screen.getByText('Trigger');

  // 숨김 상태에서는 연결 없음
  expect(trigger.getAttribute('aria-describedby')).toBeNull();

  // 보임 상태에서는 tooltip의 id와 연결됨
  await user.hover(trigger);
  act(() => { vi.advanceTimersByTime(10); });

  const tooltipId = screen.getByRole('tooltip').id;
  expect(trigger.getAttribute('aria-describedby')).toBe(tooltipId);
});
```

### disabled 상태

> 실제 파일: `src/Switch/Switch.test.tsx`

```tsx
it('is disabled when disabled prop is set', () => {
  render(<Switch label="Disabled" disabled />);

  // toBeDisabled() — HTML disabled 속성 확인
  expect(screen.getByRole('switch')).toBeDisabled();
});
```

---

## 11. 테스트 작성 순서

이 프로젝트의 테스트는 일관된 순서를 따릅니다:

```tsx
describe('ComponentName', () => {
  // 1. 기본 렌더링 — 컴포넌트가 깨지지 않고 렌더링되는지
  it('renders correctly', () => { ... });

  // 2. Props 반영 — 기본값과 커스텀 값이 올바르게 적용되는지
  it('applies default variant and size', () => { ... });
  it('applies custom variant and size', () => { ... });

  // 3. 인터랙션 — 클릭, 키보드 등 사용자 행동에 올바르게 반응하는지
  it('toggles on click', () => { ... });
  it('calls onChange when clicked', () => { ... });

  // 4. 접근성 — ARIA 속성이 올바른지
  it('has correct aria attributes', () => { ... });

  // 5. 엣지 케이스 — 비활성화, 빈 상태 등
  it('does not respond when disabled', () => { ... });
});
```

---

## 12. 자주 쓰이는 패턴 요약

### 조회

| 하고 싶은 것 | 코드 |
|---|---|
| 역할로 찾기 | `screen.getByRole('button')` |
| 라벨로 input 찾기 | `screen.getByLabelText('Name')` |
| 텍스트로 찾기 | `screen.getByText('Hello')` |
| 여러 개 찾기 | `screen.getAllByRole('tab')` |
| 없는 것 확인 | `screen.queryByText('Error')` → `null` |
| CSS 선택자 | `container.querySelector('.class')` |
| data-attribute | `element.dataset.size` |

### 인터랙션

| 하고 싶은 것 | 코드 |
|---|---|
| 클릭 | `await userEvent.click(el)` |
| 키보드 입력 | `await userEvent.keyboard('{ArrowDown}')` |
| Tab으로 포커스 이동 | `await userEvent.tab()` |
| 마우스 올리기 | `await user.hover(el)` |
| 직접 포커스 | `element.focus()` |
| 단순 이벤트 | `fireEvent.mouseLeave(el)` |

### 검증

| 하고 싶은 것 | 코드 |
|---|---|
| 존재 확인 | `expect(el).toBeDefined()` |
| 값 일치 | `expect(value).toBe('hello')` |
| 비활성화 확인 | `expect(el).toBeDisabled()` |
| 속성 확인 | `expect(el.getAttribute('aria-expanded')).toBe('true')` |
| 호출 확인 | `expect(fn).toHaveBeenCalledWith('value')` |
| 호출 횟수 | `expect(fn).toHaveBeenCalledTimes(1)` |
| 미호출 확인 | `expect(fn).not.toHaveBeenCalled()` |
| null 확인 | `expect(el).toBeNull()` |
| undefined 확인 | `expect(val).toBeUndefined()` |
| 포커스 확인 | `expect(document.activeElement).toBe(el)` |

### 타이머

| 하고 싶은 것 | 코드 |
|---|---|
| 가짜 타이머 켜기 | `vi.useFakeTimers({ shouldAdvanceTime: true })` |
| 시간 진행 | `vi.advanceTimersByTime(200)` |
| 원래 타이머 복원 | `vi.useRealTimers()` |
| 상태 업데이트 감싸기 | `act(() => { vi.advanceTimersByTime(200) })` |

---

## 핵심 철학

> **내부 구현이 아니라, 사용자가 보는 것을 테스트한다.**

- CSS 클래스명이 아니라 **역할(role)** 로 요소를 찾는다
- state 변수를 직접 확인하지 않고 **DOM에 반영된 결과**를 확인한다
- 이벤트 핸들러가 붙었는지가 아니라 **클릭했을 때 무엇이 바뀌는지**를 확인한다

이 방식의 장점: 컴포넌트의 내부 구현을 리팩토링해도 (클래스명 변경, state 구조 변경 등)
사용자에게 보이는 동작이 같다면 테스트가 깨지지 않습니다.
