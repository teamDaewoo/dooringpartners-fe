# Phase 4: Auth 구조 재구성

**목표:** 인증 관련 파일을 auth 폴더로 통합
**예상 시간:** 10분
**위험도:** 🟢 낮음 (단순 이동)

---

## 이동할 파일 목록

| 현재 경로 | 새 경로 | 설명 |
|---------|--------|-----|
| `src/contexts/AuthContext.tsx` | `src/auth/AuthContext.tsx` | 인증 Context |

---

## Step 4.1: AuthContext 이동

### 1. 파일 이동
```bash
mv src/contexts/AuthContext.tsx src/auth/AuthContext.tsx
rmdir src/contexts
```

### 2. import 경로 업데이트

**업데이트 필요 파일:**

#### `src/app/layout.tsx`
```tsx
// ❌ 기존
import { AuthProvider } from "@/contexts/AuthContext";

// ✅ 변경
import { AuthProvider } from "@/auth/AuthContext";
```

#### `src/app/(partners)/layout.tsx`
```tsx
// ❌ 기존
import { useAuth } from "@/contexts/AuthContext";

// ✅ 변경
import { useAuth } from "@/auth/AuthContext";
```

#### `src/app/(marketing)/page.tsx` (Landing)
```tsx
// useAuth를 사용한다면
// ❌ 기존
import { useAuth } from "@/contexts/AuthContext";

// ✅ 변경
import { useAuth } from "@/auth/AuthContext";
```

#### `src/app/(partners)/dashboard/page.tsx` 및 기타 페이지
```tsx
// useAuth를 사용하는 모든 페이지
// ❌ 기존
import { useAuth } from "@/contexts/AuthContext";

// ✅ 변경
import { useAuth } from "@/auth/AuthContext";
```

#### `src/components/common/TopBar.tsx`
```tsx
// ❌ 기존
import { useAuth } from "@/contexts/AuthContext";

// ✅ 변경
import { useAuth } from "@/auth/AuthContext";
```

---

## Step 4.2: Auth 타입 정의 생성

**파일:** `src/auth/types.ts`

```typescript
export interface User {
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**AuthContext.tsx 수정:**
```tsx
import { AuthContextType, User } from "./types";

// ... rest of the code
```

---

## 체크포인트

### 파일 존재 확인
- [ ] `src/auth/AuthContext.tsx` 존재
- [ ] `src/auth/types.ts` 생성됨
- [ ] `src/contexts/` 폴더 삭제됨

### import 경로 확인
```bash
# AuthContext 사용처 모두 확인
grep -r "from.*AuthContext" src --include="*.tsx"
```

**예상 결과:**
- 모든 import가 `@/auth/AuthContext`를 참조

### 기능 확인
- [ ] 로그인 기능 정상
- [ ] 로그아웃 기능 정상
- [ ] 인증 보호 (Partners 페이지) 정상
- [ ] LocalStorage 저장/불러오기 정상

### 빌드 확인
- [ ] `npm run build` 성공
- [ ] TypeScript 오류 없음
- [ ] ESLint 오류 없음

---

## 전체 import 경로 변경 명령어 (선택사항)

**macOS/Linux:**
```bash
# AuthContext import를 일괄 변경
find src -name "*.tsx" -type f -exec sed -i '' 's|from "@/contexts/AuthContext"|from "@/auth/AuthContext"|g' {} +
```

**확인 후 수동으로 하나씩 변경하는 것을 권장**

---

## 수정해야 할 파일 목록

### Root Layout
- `src/app/layout.tsx`

### Partners Layout
- `src/app/(partners)/layout.tsx`

### Components
- `src/components/common/TopBar.tsx`

### Pages (useAuth 사용 시)
- `src/app/(marketing)/page.tsx`
- `src/app/(marketing)/login/page.tsx`
- 기타 useAuth를 사용하는 모든 페이지

---

## 문제 발생 시

**Module not found:**
```bash
# 모든 AuthContext import 검색
grep -rn "AuthContext" src --include="*.tsx"

# 결과에서 @/contexts 경로를 찾아 수정
```

**로그인 안 됨:**
- AuthContext의 로직은 변경 없음
- import 경로만 확인

**타입 오류:**
- `src/auth/types.ts` 생성 확인
- AuthContext에서 types import 확인

---

## 커밋

```bash
git add .
git commit -m "refactor(structure): complete phase 4 - move auth files to auth folder"
```

---

## 다음 단계

Phase 4 완료 후 → `docs/refactoring/phase5-types-data.md` 진행
