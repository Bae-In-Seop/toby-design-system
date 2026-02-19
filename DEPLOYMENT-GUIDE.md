# 개발 → 배포 전체 사이클 가이드

## 전체 구조도

```
개발자 (로컬)                    GitHub                         npm / GitHub Pages
─────────────                   ──────                         ─────────────────
코드 수정
pnpm changeset
git push ──────────────────────→ ci.yml 실행 (lint, test, build)
                                 publish.yml 실행
                                   → changeset 파일 감지
                                   → Release PR 자동 생성
                                 storybook.yml 실행 ──────────→ Storybook 배포

Release PR 확인 & 머지 ────────→ publish.yml 재실행
                                   → changeset 파일 없음
                                   → npm publish 실행 ────────→ 새 버전 배포됨
```

---

## 1단계: 로컬에서 코드 수정

예를 들어 Button에 `outline` variant를 추가했다고 가정합니다.

```tsx
// packages/ui/src/Button/Button.tsx
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'; // outline 추가
```

CSS, 스토리, 테스트도 함께 수정합니다.

---

## 2단계: Changeset 생성

코드 수정이 끝나면 터미널에서 실행합니다:

```bash
pnpm changeset
```

대화형 프롬프트가 나옵니다:

```
🦋 Which packages would you like to include?
   ◯ @toby-design/tokens
   ◉ @toby-design/components    ← 스페이스바로 선택

🦋 Which packages should have a major bump?
   (아무것도 선택 안 함 → 엔터)

🦋 Which packages should have a minor bump?
   ◉ @toby-design/components    ← 기능 추가니까 minor

🦋 Summary: Button에 outline variant 추가
```

`.changeset/` 폴더에 랜덤 이름의 파일이 생깁니다:

```md
<!-- .changeset/curly-birds-dance.md -->
---
"@toby-design/components": minor
---

Button에 outline variant 추가
```

이 파일의 의미: **"@toby-design/components에 minor 수준의 변경이 있고, 아직 릴리스되지 않았다"**

### 버전 수준 기준 (semver)

| 수준 | 예시 | 언제 사용하는가 |
|------|------|----------------|
| `patch` | 0.0.1 → 0.0.2 | 버그 수정, 내부 리팩토링 |
| `minor` | 0.0.1 → 0.1.0 | 새 기능 추가 (기존 API 호환) |
| `major` | 0.0.1 → 1.0.0 | breaking change (기존 API 깨짐) |

---

## 3단계: 커밋 & 푸시

changeset 파일을 코드와 함께 커밋합니다:

```bash
git add .
git commit -m "feat: Button에 outline variant 추가"
git push origin main
```

---

## 4단계: GitHub Actions 트리거

main에 push되면 **3개의 워크플로우가 동시에** 실행됩니다.

### ci.yml — 코드 품질 검증

```
Install → Lint → Type Check → Test (33개) → Build
```

- 하나라도 실패하면 GitHub에 빨간 X 표시
- PR 기반으로 작업할 경우 머지 전에 코드 품질을 보장하는 역할

### publish.yml — 릴리스 관리

```
Install → Build → changesets/action 실행
```

`changesets/action`이 `.changeset/` 폴더를 확인합니다.

**changeset 파일이 있는 경우** (지금 상황):

1. 자동으로 `changeset version` 실행
   - `package.json` 버전 bump: `0.0.1` → `0.1.0`
   - `CHANGELOG.md` 자동 생성:
     ```md
     # @toby-design/components

     ## 0.1.0

     ### Minor Changes
     - Button에 outline variant 추가
     ```
   - changeset 파일 삭제 (이미 반영됐으므로)
2. 이 변경들을 담은 **Release PR**을 자동 생성

GitHub에 이런 PR이 자동으로 올라옵니다:

```
PR #12: chore: release packages
─────────────────────────────────
이 PR이 포함하는 변경:

@toby-design/components@0.1.0
- Button에 outline variant 추가

변경된 파일:
- packages/ui/package.json (version: 0.0.1 → 0.1.0)
- packages/ui/CHANGELOG.md (신규 생성)
- .changeset/curly-birds-dance.md (삭제)
```

**changeset 파일이 없는 경우**: npm publish를 실행합니다 (5단계에서 설명)

### storybook.yml — 문서 배포

```
Install → Build packages → Build Storybook → Deploy to GitHub Pages
```

- `apps/docs/dist`를 GitHub Pages에 배포
- main에 push할 때마다 최신 Storybook이 자동 반영

---

## 5단계: Release PR 확인 & 머지

개발자가 GitHub에서 Release PR을 확인합니다:

- 버전 번호가 맞는지
- CHANGELOG 내용이 적절한지
- 문제없으면 **Merge** 클릭

---

## 6단계: 머지 후 자동 npm 배포

Release PR이 머지되면 다시 main에 push가 발생하고, `publish.yml`이 다시 실행됩니다.

이번에는 changeset 파일이 없습니다 (Release PR에서 이미 삭제됨).
그래서 `changesets/action`이 **npm publish를 실행**합니다:

```
npm publish @toby-design/components@0.1.0
```

npm에 새 버전이 배포됩니다.

---

## 전체 타임라인 요약

```
Day 1: 개발
├── Button outline variant 코드 작성
├── pnpm changeset → changeset 파일 생성
├── git commit & push
│
├── [자동] ci.yml: lint ✅ test ✅ build ✅
├── [자동] storybook.yml: Storybook 배포 ✅
└── [자동] publish.yml: Release PR 생성 ✅

Day 2: 릴리스
├── Release PR 확인 → 머지
│
├── [자동] ci.yml: lint ✅ test ✅ build ✅
└── [자동] publish.yml: npm publish 실행
    └── @toby-design/components@0.1.0 배포 완료 ✅
```

---

## 여러 변경을 모아서 릴리스하는 경우

changeset은 여러 개를 쌓아둘 수 있습니다:

```bash
# 월요일: Button 수정
pnpm changeset  →  .changeset/curly-birds-dance.md (components: minor)
git commit & push

# 화요일: Input 버그 수정
pnpm changeset  →  .changeset/wild-cats-run.md (components: patch)
git commit & push

# 수요일: 토큰 추가
pnpm changeset  →  .changeset/happy-dogs-fly.md (tokens: minor, components: patch)
git commit & push
```

Release PR에는 3개의 변경이 모두 합쳐져서 나옵니다:

- `@toby-design/tokens`: 0.0.1 → 0.1.0 (minor가 가장 높으므로)
- `@toby-design/components`: 0.0.1 → 0.1.0 (minor가 가장 높으므로)

머지 한 번으로 두 패키지가 동시에 배포됩니다.

---

## 의존성 자동 처리

`@toby-design/components`는 `@toby-design/tokens`에 의존하고 있습니다.

tokens의 버전이 올라가면 changesets가 자동으로 components의 `dependencies`에 있는 tokens 버전도 업데이트해 줍니다.

이것이 `.changeset/config.json`의 `"updateInternalDependencies": "patch"` 설정입니다.

---

## GitHub 설정 필요 사항

### 1. NPM_TOKEN 시크릿 등록

repo Settings → Secrets and variables → Actions → New repository secret

- **Name**: `NPM_TOKEN`
- **Value**: npm Granular Access Token (bypass 옵션 활성화된 것)

### 2. GitHub Pages 활성화

repo Settings → Pages → Source → **"GitHub Actions"** 선택
