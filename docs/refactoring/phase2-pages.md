# Phase 2: 페이지 파일 이동

**목표:** 페이지를 (marketing), (partners) 그룹으로 분리
**예상 시간:** 20-30분
**위험도:** 🟡 중간 (라우팅 변경)

---

## 이동할 파일 목록

### (marketing) 그룹 - 로그인 전

| 현재 경로 | 새 경로 | URL |
|---------|--------|-----|
| `src/app/page.tsx` | `src/app/(marketing)/page.tsx` | `/` |
| `src/app/login/page.tsx` | `src/app/(marketing)/login/page.tsx` | `/login` |

### (partners) 그룹 - 로그인 후

| 현재 경로 | 새 경로 | URL 변경 |
|---------|--------|---------|
| `src/app/report/page.tsx` | `src/app/(partners)/dashboard/page.tsx` | `/report` → `/dashboard` |
| `src/app/products/page.tsx` | `src/app/(partners)/products/page.tsx` | `/products` (유지) |
| `src/app/product/[id]/page.tsx` | `src/app/(partners)/products/[id]/page.tsx` | `/product/123` → `/products/123` |
| `src/app/links/page.tsx` | `src/app/(partners)/links/page.tsx` | `/links` (유지) |
| `src/app/receipt/page.tsx` | `src/app/(partners)/receipt/page.tsx` | `/receipt` (유지) |
| `src/app/notice/page.tsx` | `src/app/(partners)/notice/page.tsx` | `/notice` (유지) |
| `src/app/qna/page.tsx` | `src/app/(partners)/qna/page.tsx` | `/qna` (유지) |
| `src/app/guide/page.tsx` | `src/app/(partners)/guide/page.tsx` | `/guide` (유지) |

---

## Step 2.1: (marketing) 레이아웃 및 페이지 생성

### 1. Marketing Layout 생성
**파일:** `src/app/(marketing)/layout.tsx`

```tsx
'use client';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* 간단한 헤더만 (추후 구현) */}
      <main>{children}</main>
    </div>
  );
}
```

### 2. 페이지 이동
```bash
# Landing 페이지
mv src/app/page.tsx src/app/\(marketing\)/page.tsx

# Login 페이지
mv src/app/login/page.tsx src/app/\(marketing\)/login/page.tsx
rmdir src/app/login
```

### 체크포인트
- [ ] `/` 접속 확인
- [ ] `/login` 접속 확인
- [ ] 페이지 렌더링 정상

---

## Step 2.2: (partners) 레이아웃 및 페이지 이동

### 1. Partners Layout 생성
**파일:** `src/app/(partners)/layout.tsx`

```tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/contexts/AuthContext";

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>{children}</main>
    </div>
  );
}
```

### 2. Dashboard (기존 report) 이동
```bash
mv src/app/report/page.tsx src/app/\(partners\)/dashboard/page.tsx
rmdir src/app/report
```

**수정 필요:**
- `src/app/(partners)/dashboard/page.tsx` 에서 ProtectedRoute 제거 (Layout에서 처리)
- Layout 제거 (Partners Layout에서 처리)

### 3. Products 페이지 이동
```bash
# 상품 목록
mv src/app/products/page.tsx src/app/\(partners\)/products/page.tsx
rmdir src/app/products

# 상품 상세
mv src/app/product/\[id\]/page.tsx src/app/\(partners\)/products/\[id\]/page.tsx
rmdir src/app/product/\[id\]
rmdir src/app/product
```

**수정 필요:**
- 두 페이지 모두 ProtectedRoute, Layout 제거
- 상품 상세의 Link: `/product/${id}` → `/products/${id}`

### 4. 나머지 페이지 이동
```bash
mv src/app/links/page.tsx src/app/\(partners\)/links/page.tsx
rmdir src/app/links

mv src/app/receipt/page.tsx src/app/\(partners\)/receipt/page.tsx
rmdir src/app/receipt

mv src/app/notice/page.tsx src/app/\(partners\)/notice/page.tsx
rmdir src/app/notice

mv src/app/qna/page.tsx src/app/\(partners\)/qna/page.tsx
rmdir src/app/qna

mv src/app/guide/page.tsx src/app/\(partners\)/guide/page.tsx
rmdir src/app/guide
```

**모든 페이지 수정 필요:**
- ProtectedRoute wrapper 제거
- Layout wrapper 제거

---

## Step 2.3: Root Layout 수정

**파일:** `src/app/layout.tsx`

기존 코드에서 TopBar 관련 제거, Providers만 유지:

```tsx
'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="ko">
      <head>
        <title>Dooring Partners</title>
        <meta name="description" content="Dooring Partners Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <Sonner />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## Step 2.4: TopBar 링크 업데이트

**파일:** `src/components/TopBar.tsx`

URL 변경 반영:

```tsx
const navItems: NavItem[] = [
  { label: "홈", href: "/dashboard" },  // /report → /dashboard
  { label: "상품 둘러보기", href: "/products" },
  {
    label: "내 활동",
    dropdown: [
      { label: "컨텐츠 관리", href: "/links" },
    ],
  },
  { label: "정산 관리", href: "/receipt" },
  {
    label: "고객지원",
    dropdown: [
      { label: "공지사항", href: "/notice" },
      { label: "문의하기", href: "/qna" },
      { label: "이용 가이드", href: "/guide" },
    ],
  },
];
```

---

## 체크포인트

### 라우팅 확인
- [ ] `/` - Landing 페이지
- [ ] `/login` - 로그인 페이지
- [ ] `/dashboard` - 대시보드 (기존 /report)
- [ ] `/products` - 상품 목록
- [ ] `/products/1` - 상품 상세 (기존 /product/1)
- [ ] `/links` - 링크 관리
- [ ] `/receipt` - 정산 관리
- [ ] `/notice` - 공지사항
- [ ] `/qna` - Q&A
- [ ] `/guide` - 사용 가이드

### 인증 확인
- [ ] 로그인 전 → `/dashboard` 접근 시 `/login`으로 리다이렉트
- [ ] 로그인 후 → 모든 partners 페이지 접근 가능
- [ ] TopBar 정상 표시 (partners 페이지에만)

### 빌드 확인
- [ ] `npm run build` 성공
- [ ] TypeScript 오류 없음
- [ ] ESLint 오류 없음

---

## 수정해야 할 파일 목록

### 각 Partners 페이지에서 제거
```tsx
// ❌ 제거
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Layout>
        {/* 내용 */}
      </Layout>
    </ProtectedRoute>
  );
}

// ✅ 변경 후
export default function Page() {
  return (
    <>
      {/* 내용 */}
    </>
  );
}
```

### 상품 카드에서 Link 수정
```tsx
// ❌ 기존
<Link href={`/product/${product.id}`}>

// ✅ 변경
<Link href={`/products/${product.id}`}>
```

---

## 문제 발생 시

**페이지 404:**
- 폴더 이름 확인 (괄호, 대괄호)
- page.tsx 파일 존재 확인

**무한 리다이렉트:**
- AuthContext의 isLoading 상태 확인
- Partners Layout의 useEffect 로직 확인

**TopBar 안 보임:**
- Partners Layout에 TopBar import 확인
- 로그인 상태 확인

---

## 커밋

```bash
git add .
git commit -m "refactor(structure): complete phase 2 - reorganize pages into marketing and partners groups"
```

---

## 다음 단계

Phase 2 완료 후 → `docs/refactoring/phase3-components.md` 진행
