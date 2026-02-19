# Toby Design System - 진행 상태

## 프로젝트 정보

| 항목 | 값 |
|-----|---|
| 프로젝트명 | toby-design-system |
| GitHub 레포 | https://github.com/Bae-In-Seop/toby-design-system |
| npm 계정 | bis0212 |
| npm org | @toby-design |
| npm 패키지 (tokens) | @toby-design/tokens@0.0.1 ✅ published |
| npm 패키지 (components) | @toby-design/components@0.0.1 ✅ published |

## 환경 정보

| 항목 | 버전 |
|-----|-----|
| Node.js | v22.17.0 |
| pnpm | 10.30.0 |
| OS | Windows |
| Storybook | 10.2.10 |
| Vite | 6.x |
| Vitest | 1.2.x |
| tsup | 8.x |

---

## 진행 상태

### Phase 0: 사전 준비 - 완료

- [x] Node.js 20+ 설치 확인
- [x] pnpm 설치 확인
- [x] npm 계정 및 username 확인
- [x] GitHub 레포지토리 생성

### Phase 1: Monorepo 초기화 - 완료

- [x] pnpm init + 기본 package.json
- [x] 폴더 구조 생성
- [x] pnpm-workspace.yaml 작성
- [x] pnpm install 실행 및 확인
- [x] TypeScript, ESLint, Prettier 설정
- [x] 설정 파일 검토 및 조정

### Phase 2: Design Tokens - 완료

- [x] Figma Tokens Studio 플러그인 설치
- [x] 토큰 정의 (color, spacing, radius)
- [x] fontSize, fontWeight, shadow 토큰 추가
- [x] JSON export → packages/tokens/raw/tokens.json
- [x] sync-tokens.ts 스크립트 작성 (Tokens Studio 포맷 대응)
- [x] CSS Variables + TypeScript 상수 자동 생성 (28개 토큰)
- [x] TS 출력 camelCase 키 + 카테고리 prefix 제거 수정

### Phase 3: 컴포넌트 템플릿 - 완료

- [x] templates/ 폴더에 .hbs 템플릿 5개 작성
  - Component.tsx.hbs, Component.module.css.hbs, Component.stories.tsx.hbs, Component.test.tsx.hbs, index.ts.hbs
- [x] scripts/generate-component.ts 작성 (단순 문자열 치환 방식)
- [x] `pnpm generate <ComponentName>` 테스트 확인

### Phase 4: 컴포넌트 개발 - 완료

- [x] Button (variant: primary/secondary/ghost/danger, size, loading, disabled)
- [x] Input (variant: outlined/filled, size, error, label, a11y)
- [x] Select (options, size, label, error, placeholder, custom arrow)
- [x] Badge (variant: primary/secondary/success/error, size)
- [x] Typography (as 다형성, variant: heading/body/caption, size, muted)
- [x] Card (padding, shadow)
- [x] Dialog (open, onClose, title, Focus Trap, ESC 닫기, 포커스 복원, aria)
- [x] Checkbox (label, size, indeterminate, 커스텀 체크 SVG, 접근성)
- [x] Toast (ToastProvider + useToast 훅, variant: success/error/warning/info, 자동 소멸, 스택)
- [x] Tabs (items, value, 키보드 좌우 화살표, role="tablist"/"tab"/"tabpanel", disabled 탭 스킵)
- [x] packages/ui/src/index.ts barrel export (10개 컴포넌트 + 타입)

### Phase 5: Storybook - 완료

- [x] .storybook/main.ts 설정 (stories 경로, addons)
- [x] .storybook/preview.ts 설정 (토큰 CSS 전역 import)
- [x] Storybook v8 → v10.2.10 업그레이드
- [x] Vite 5 → 6 업그레이드
- [x] pnpm hoisting 설정 (.npmrc)
- [x] Getting Started 문서 페이지 (GettingStarted.mdx)
- [x] Design Tokens 시각화 페이지 (DesignTokens.mdx)
- [x] 7개 컴포넌트 스토리 작성 완료 (autodocs)

### Phase 6: 테스트 - 완료

- [x] vitest.config.ts 설정 (jsdom, globals, CSS Modules)
- [x] test-setup.ts 작성 (@testing-library/jest-dom/vitest)
- [x] CSS Modules 타입 선언 (src/types/css.d.ts)
- [x] Input/Select size prop 충돌 해결 (Omit 패턴)
- [x] SelectOption 타입 재수출 추가
- [x] **54개 테스트 전체 통과** (10개 컴포넌트)
- [x] `tsc --noEmit` 타입 체크 통과

### Phase 7: 빌드 & 배포 - 완료

- [x] tsup 빌드 (ESM + CJS + DTS)
- [x] npm org 생성 (@toby-design)
- [x] 패키지명 변경: @toby-design/tokens, @toby-design/components
- [x] **@toby-design/tokens@0.0.1 npm 배포 완료**
- [x] **@toby-design/components@0.0.1 npm 배포 완료**
- [x] Changesets 초기화 (access: public, baseBranch: main)
- [x] changeset / version-packages / release 스크립트 추가
- [x] GitHub Actions CI 워크플로우 (ci.yml - lint, typecheck, test, build)
- [x] GitHub Actions npm 자동 배포 워크플로우 (publish.yml - changesets/action)
- [x] Storybook GitHub Pages 배포 워크플로우 (storybook.yml - deploy-pages)

---

## GitHub 설정 필요 사항

배포 워크플로우가 정상 동작하려면 GitHub에서 아래 설정이 필요합니다:

1. **NPM_TOKEN 시크릿 등록**
   - repo Settings → Secrets and variables → Actions → New repository secret
   - Name: `NPM_TOKEN`, Value: npm Granular Access Token

2. **GitHub Pages 활성화**
   - repo Settings → Pages → Source → "GitHub Actions" 선택

---

## 완료 상태

**전체 Phase 0~7 완료**

---

## 주요 해결 이슈

| 이슈 | 해결 방법 |
|------|-----------|
| Handlebars JSX 충돌 | Handlebars 엔진 → 단순 문자열 치환 방식 전환 |
| Storybook 10 MDX 해석 오류 | Vite 5→6 업그레이드 + .npmrc hoisting 설정 |
| vitest jest-dom 매처 미인식 | test-setup.ts + setupFiles 설정 |
| CSS Modules tsc 오류 | src/types/css.d.ts 타입 선언 추가 |
| Input/Select size prop 충돌 | `Omit<HTMLAttributes, 'size'>` 패턴 적용 |
| npm 2FA/패스키 이슈 | Granular Access Token (bypass 옵션) 발급 |

---

## 참고 문서

- `design-system-mvp-final.md` - 전체 MVP 계획서
