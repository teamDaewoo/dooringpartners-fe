# Phase 6: 기존 파일 정리

**목표:** 이동 완료된 파일 및 빈 폴더 삭제
**예상 시간:** 10분
**위험도:** 🟡 중간 (실수 삭제 위험)

---

## 삭제할 파일 및 폴더

### 이동 완료된 페이지 폴더 (Phase 2)
```
src/app/login/          # → (marketing)/login/
src/app/report/         # → (partners)/dashboard/
src/app/products/       # → (partners)/products/
src/app/product/        # → (partners)/products/[id]/
src/app/links/          # → (partners)/links/
src/app/receipt/        # → (partners)/receipt/
src/app/notice/         # → (partners)/notice/
src/app/qna/            # → (partners)/qna/
src/app/guide/          # → (partners)/guide/
```

### 이동 완료된 컴포넌트 (Phase 3)
```
src/components/Layout.tsx           # (삭제 - 사용 안 함)
src/components/TopBar.tsx           # → common/TopBar.tsx
src/components/NavLink.tsx          # → common/NavLink.tsx
src/components/ProtectedRoute.tsx   # (삭제 - 사용 안 함)
src/components/KPICard.tsx          # → common/KPICard.tsx
```

### 이동 완료된 Auth (Phase 4)
```
src/contexts/                       # → src/auth/
```

---

## Step 6.1: 삭제 전 확인

### 1. 남아있는 파일 확인
```bash
# src/app 하위에 남은 페이지 폴더 확인
ls -la src/app/

# src/components 하위에 남은 컴포넌트 확인
ls -la src/components/

# src/contexts 폴더 확인
ls -la src/ | grep contexts
```

**예상 결과:**
```
src/app/
├── (marketing)/
├── (partners)/
├── layout.tsx
├── globals.css
└── not-found.tsx

src/components/
├── common/
├── auth/
├── dashboard/
├── campaign/
├── link/
├── notice/
└── ui/

src/contexts/  ← 없어야 함
```

### 2. import 사용 확인 (중요!)
```bash
# 삭제할 폴더들이 여전히 import되는지 확인
grep -r "from.*@/app/report" src --include="*.tsx"
grep -r "from.*@/app/products" src --include="*.tsx"
grep -r "from.*@/components/Layout" src --include="*.tsx"
grep -r "from.*@/components/TopBar" src --include="*.tsx"
grep -r "from.*@/contexts" src --include="*.tsx"
```

**예상 결과:** 아무것도 출력되지 않아야 함

---

## Step 6.2: 안전한 삭제

### 방법 1: 백업 후 삭제 (권장)
```bash
# 임시 백업 폴더 생성
mkdir -p /tmp/refactoring-backup

# 삭제할 폴더들 백업
cp -r src/app/login /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/report /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/products /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/product /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/links /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/receipt /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/notice /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/qna /tmp/refactoring-backup/ 2>/dev/null || true
cp -r src/app/guide /tmp/refactoring-backup/ 2>/dev/null || true

# 빈 폴더라면 이미 삭제되었을 수 있으므로 2>/dev/null로 에러 무시

# 실제 삭제
rm -rf src/app/login
rm -rf src/app/report
rm -rf src/app/products
rm -rf src/app/product
rm -rf src/app/links
rm -rf src/app/receipt
rm -rf src/app/notice
rm -rf src/app/qna
rm -rf src/app/guide

# contexts 폴더 삭제 (이미 비어있을 것)
rm -rf src/contexts
```

### 방법 2: Git을 활용한 삭제
```bash
# Git으로 삭제 (변경 이력 추적)
git rm -rf src/app/login
git rm -rf src/app/report
git rm -rf src/app/products
git rm -rf src/app/product
git rm -rf src/app/links
git rm -rf src/app/receipt
git rm -rf src/app/notice
git rm -rf src/app/qna
git rm -rf src/app/guide
git rm -rf src/contexts
```

---

## Step 6.3: 삭제 후 검증

### 1. 빌드 테스트
```bash
# 캐시 삭제 후 빌드
rm -rf .next
npm run build
```

**예상 결과:** 빌드 성공

### 2. 페이지 접속 테스트
```bash
npm run dev
```

**테스트할 URL:**
- [ ] `/` (Landing)
- [ ] `/login`
- [ ] `/dashboard` (기존 /report)
- [ ] `/products`
- [ ] `/products/1` (기존 /product/1)
- [ ] `/links`
- [ ] `/receipt`
- [ ] `/notice`
- [ ] `/qna`
- [ ] `/guide`

### 3. 네비게이션 테스트
- [ ] TopBar의 모든 링크 클릭
- [ ] 로그인/로그아웃
- [ ] 페이지 간 이동

### 4. Git 상태 확인
```bash
git status
```

**확인:**
- 의도하지 않은 파일 삭제 없음
- 필요한 파일만 삭제됨

---

## Step 6.4: 최종 폴더 구조 확인

```bash
tree src -L 3 -I 'ui'
```

**예상 구조:**
```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── login/
│   ├── (partners)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── links/
│   │   ├── receipt/
│   │   ├── notice/
│   │   ├── qna/
│   │   └── guide/
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
├── components/
│   ├── common/
│   │   ├── TopBar.tsx
│   │   ├── NavLink.tsx
│   │   └── KPICard.tsx
│   ├── auth/
│   ├── dashboard/
│   ├── campaign/
│   ├── link/
│   └── notice/
├── hooks/
│   ├── campaign/
│   ├── link/
│   ├── notice/
│   └── use-*.tsx
├── auth/
│   ├── AuthContext.tsx
│   └── types.ts
├── types/
│   ├── product.ts
│   ├── link.ts
│   ├── notice.ts
│   ├── settlement.ts
│   ├── qna.ts
│   ├── guide.ts
│   ├── dashboard.ts
│   └── common.ts
├── data/
│   └── mockData.ts
└── lib/
    └── utils.ts
```

---

## 체크포인트

### 파일 삭제 확인
- [ ] `src/app/login/` 삭제됨
- [ ] `src/app/report/` 삭제됨
- [ ] `src/app/products/` 삭제됨
- [ ] `src/app/product/` 삭제됨
- [ ] `src/app/links/` 삭제됨
- [ ] `src/app/receipt/` 삭제됨
- [ ] `src/app/notice/` 삭제됨
- [ ] `src/app/qna/` 삭제됨
- [ ] `src/app/guide/` 삭제됨
- [ ] `src/contexts/` 삭제됨

### 빌드 확인
- [ ] `npm run build` 성공
- [ ] TypeScript 오류 없음
- [ ] ESLint 오류 없음

### 기능 확인
- [ ] 모든 페이지 정상 접속
- [ ] 네비게이션 정상 작동
- [ ] 로그인/로그아웃 정상
- [ ] 데이터 표시 정상

---

## 문제 발생 시

**빌드 실패:**
```bash
# 오류 메시지 확인
npm run build

# 특정 파일이 여전히 import되고 있다면
grep -r "[파일명]" src --include="*.tsx"
```

**페이지 404:**
- URL이 변경되었는지 확인 (/report → /dashboard, /product → /products)
- TopBar의 링크 업데이트 확인

**실수로 삭제한 경우:**
```bash
# Git으로 복구
git checkout src/[경로]

# 또는 백업에서 복구
cp -r /tmp/refactoring-backup/[폴더] src/[경로]
```

---

## 커밋

```bash
git add .
git commit -m "refactor(structure): complete phase 6 - clean up old files and folders"
```

---

## 최종 검증

### 전체 테스트 시나리오
1. 로그인 전 → Landing 페이지 확인
2. 로그인 실행
3. Dashboard 접속 (/dashboard)
4. 모든 메뉴 클릭하여 페이지 전환 확인
5. 상품 상세 페이지 이동 테스트
6. 로그아웃
7. 보호된 페이지 접근 → 로그인으로 리다이렉트 확인

---

## 완료!

축하합니다! 폴더 구조 리팩토링이 완료되었습니다.

다음 단계:
- Phase 7: 페이지 코드 분할 (별도 계획)
- React Query 도입
- 라이브러리 기반 인증 시스템
