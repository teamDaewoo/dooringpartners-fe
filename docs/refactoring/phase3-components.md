# Phase 3: 컴포넌트 파일 이동

**목표:** 컴포넌트를 도메인별로 분류
**예상 시간:** 15-20분
**위험도:** 🟡 중간 (import 경로 대량 변경)

---

## 이동할 파일 목록

### Common 컴포넌트

| 현재 경로 | 새 경로 | 사용처 |
|---------|--------|-------|
| `src/components/Layout.tsx` | `src/components/common/Layout.tsx` | (사용 안 함 - 삭제 예정) |
| `src/components/TopBar.tsx` | `src/components/common/TopBar.tsx` | Partners Layout |
| `src/components/NavLink.tsx` | `src/components/common/NavLink.tsx` | TopBar |

### Auth 컴포넌트

| 현재 경로 | 새 경로 | 사용처 |
|---------|--------|-------|
| `src/components/ProtectedRoute.tsx` | `src/components/auth/ProtectedRoute.tsx` | (사용 안 함 - 삭제 예정) |

### Dashboard 컴포넌트

| 현재 경로 | 새 경로 | 사용처 |
|---------|--------|-------|
| `src/components/KPICard.tsx` | `src/components/dashboard/KPICard.tsx` | Dashboard, Receipt (2곳) |

**KPICard 위치 결정:**
- Receipt 페이지에서도 사용 → `components/common/KPICard.tsx`로 이동

---

## Step 3.1: Common 컴포넌트 이동

### 1. TopBar 이동
```bash
mv src/components/TopBar.tsx src/components/common/TopBar.tsx
```

**import 경로 업데이트 필요:**
- `src/app/(partners)/layout.tsx`
```tsx
// ❌ 기존
import TopBar from "@/components/TopBar";

// ✅ 변경
import TopBar from "@/components/common/TopBar";
```

### 2. NavLink 이동
```bash
mv src/components/NavLink.tsx src/components/common/NavLink.tsx
```

**import 경로 업데이트 필요:**
- `src/components/common/TopBar.tsx`
```tsx
// ❌ 기존
import NavLink from "@/components/NavLink";

// ✅ 변경
import NavLink from "@/components/common/NavLink";
```

### 3. Layout 삭제 (사용 안 함)
```bash
rm src/components/Layout.tsx
```

**확인:**
- [ ] 어디에서도 import하지 않음 (Phase 2에서 제거 완료)

---

## Step 3.2: Auth 컴포넌트 이동

### 1. ProtectedRoute 삭제 (사용 안 함)
```bash
rm src/components/ProtectedRoute.tsx
```

**확인:**
- [ ] 어디에서도 import하지 않음 (Phase 2에서 제거 완료)

---

## Step 3.3: Dashboard 컴포넌트 이동

### 1. KPICard 사용처 확인
```bash
grep -r "KPICard" src/app --include="*.tsx"
```

**사용처:**
- `src/app/(partners)/dashboard/page.tsx`
- `src/app/(partners)/receipt/page.tsx`

**결정:** 2곳 이상 사용 → `components/common/`으로 이동

### 2. KPICard 이동
```bash
mv src/components/KPICard.tsx src/components/common/KPICard.tsx
```

**import 경로 업데이트 필요:**

- `src/app/(partners)/dashboard/page.tsx`
```tsx
// ❌ 기존
import KPICard from "@/components/KPICard";

// ✅ 변경
import KPICard from "@/components/common/KPICard";
```

- `src/app/(partners)/receipt/page.tsx`
```tsx
// ❌ 기존
import KPICard from "@/components/KPICard";

// ✅ 변경
import KPICard from "@/components/common/KPICard";
```

---

## 체크포인트

### 파일 존재 확인
- [ ] `src/components/common/TopBar.tsx` 존재
- [ ] `src/components/common/NavLink.tsx` 존재
- [ ] `src/components/common/KPICard.tsx` 존재
- [ ] `src/components/Layout.tsx` 삭제됨
- [ ] `src/components/ProtectedRoute.tsx` 삭제됨

### import 경로 확인
```bash
# TopBar 사용처 확인
grep -r "from.*TopBar" src --include="*.tsx"

# NavLink 사용처 확인
grep -r "from.*NavLink" src --include="*.tsx"

# KPICard 사용처 확인
grep -r "from.*KPICard" src --include="*.tsx"
```

**예상 결과:**
- TopBar: `@/components/common/TopBar`만 존재
- NavLink: `@/components/common/NavLink`만 존재
- KPICard: `@/components/common/KPICard`만 존재

### 기능 확인
- [ ] `/dashboard` 페이지 정상 (KPICard 표시)
- [ ] `/receipt` 페이지 정상 (KPICard 표시)
- [ ] 모든 페이지에서 TopBar 정상 표시
- [ ] TopBar 네비게이션 링크 동작

### 빌드 확인
- [ ] `npm run build` 성공
- [ ] TypeScript 오류 없음
- [ ] ESLint 오류 없음

---

## 수정해야 할 파일 정리

### `src/app/(partners)/layout.tsx`
```tsx
// import 변경
import TopBar from "@/components/common/TopBar";
```

### `src/components/common/TopBar.tsx`
```tsx
// import 변경
import NavLink from "@/components/common/NavLink";
```

### `src/app/(partners)/dashboard/page.tsx`
```tsx
// import 변경
import KPICard from "@/components/common/KPICard";
```

### `src/app/(partners)/receipt/page.tsx`
```tsx
// import 변경
import KPICard from "@/components/common/KPICard";
```

---

## 문제 발생 시

**Module not found 오류:**
```bash
# import 경로 검색
grep -r "from.*[파일명]" src --include="*.tsx"

# 누락된 경로 찾아서 수정
```

**컴포넌트 렌더링 안 됨:**
- export default 확인
- 파일 이름 정확히 확인

**빌드 실패:**
```bash
# TypeScript 캐시 삭제
rm -rf .next
npm run build
```

---

## 커밋

```bash
git add .
git commit -m "refactor(structure): complete phase 3 - reorganize components by domain"
```

---

## 다음 단계

Phase 3 완료 후 → `docs/refactoring/phase4-auth.md` 진행
