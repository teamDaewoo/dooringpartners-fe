# Phase 10: React Query 도입 (캐싱 및 서버 상태 관리)

## 📋 개요

**목표**: React Query(TanStack Query) 도입으로 서버 상태 관리 최적화
**예상 시간**: 90-120분
**위험도**: 🟡 중간 (새로운 라이브러리 도입)
**선행 작업**: Phase 9 완료
**후속 작업**: 없음 (최종 단계)

---

## 🎯 목표

1. React Query 라이브러리 설치 및 설정
2. Hook에서 `useState + useEffect` → `useQuery` 전환
3. 캐싱, 자동 재요청, 낙관적 업데이트 활용
4. 로딩/에러 처리 개선
5. 개발자 도구를 통한 디버깅 향상

---

## 📦 라이브러리 설치

### Step 1: 패키지 설치

```bash
npm install @tanstack/react-query@^5.0.0
npm install @tanstack/react-query-devtools@^5.0.0
```

---

## 🎨 React Query 설정

### Step 2: QueryClient 설정

```typescript
// src/lib/queryClient.ts

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정
      staleTime: 1000 * 60 * 5, // 5분 (데이터가 "신선"한 상태로 유지되는 시간)
      gcTime: 1000 * 60 * 10,   // 10분 (가비지 컬렉션 시간, 이전 cacheTime)
      retry: 1,                 // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
    },
  },
});
```

### Step 3: Provider 설정

```typescript
// src/app/layout.tsx

'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/auth/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
          </AuthProvider>
          {/* 개발 환경에서만 DevTools 표시 */}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

---

## 📝 Query Key 설계

### Step 4: Query Key Factory

일관된 Query Key 관리를 위한 Factory 패턴:

```typescript
// src/api/queryKeys.ts

/**
 * Query Key Factory
 * 일관된 캐시 키 관리를 위한 패턴
 */

export const queryKeys = {
  // Product
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },

  // Category
  categories: {
    all: ["categories"] as const,
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    kpis: (dateRange: string) => [...queryKeys.dashboard.all, "kpis", dateRange] as const,
    chart: (dateRange: string) => [...queryKeys.dashboard.all, "chart", dateRange] as const,
  },

  // Link
  links: {
    all: ["links"] as const,
    lists: () => [...queryKeys.links.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.links.lists(), filters] as const,
  },

  // Settlement
  settlements: {
    all: ["settlements"] as const,
    kpis: () => [...queryKeys.settlements.all, "kpis"] as const,
    lists: () => [...queryKeys.settlements.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.settlements.lists(), filters] as const,
  },

  // Notice
  notices: {
    all: ["notices"] as const,
    lists: () => [...queryKeys.notices.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.notices.lists(), filters] as const,
  },

  // QnA
  qna: {
    all: ["qna"] as const,
  },

  // Guide
  guide: {
    all: ["guide"] as const,
  },
} as const;
```

---

## 🔧 Hook 리팩토링

### Step 5: useQuery로 전환

#### 5.1 useProducts (복잡한 예시)

**변경 전 (Phase 9)**
```typescript
export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesData] = await Promise.all([
          getProducts({ page: currentPage, perPage }),
          getCategories(),
        ]);
        setProducts(productsRes.products);
        setCategories(categoriesData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, perPage]);

  // ...
}
```

**변경 후 (Phase 10)**
```typescript
// src/hooks/product/useProducts.ts

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product, ProductCategory } from "@/types/product";
import { getProducts, getCategories } from "@/api/product";
import { queryKeys } from "@/api/queryKeys";

interface UseProductsOptions {
  initialCategory?: string;
  perPage?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { initialCategory = "전체", perPage = 6 } = options;

  // 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [includeIssued, setIncludeIssued] = useState(false);

  // ✅ React Query: 상품 목록 조회
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: queryKeys.products.list({ page: currentPage, perPage }),
    queryFn: () => getProducts({ page: currentPage, perPage }),
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  // ✅ React Query: 카테고리 조회
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30분 캐싱 (카테고리는 자주 변하지 않음)
  });

  const products = productsData?.products || [];
  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError;

  // 클라이언트 사이드 필터링
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [filteredProducts, currentPage, perPage]);

  // 카테고리 변경 시 페이지 리셋
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    // 상태
    searchQuery,
    selectedCategory,
    currentPage,
    includeIssued,

    // 핸들러
    setSearchQuery: handleSearchChange,
    setSelectedCategory: handleCategoryChange,
    setCurrentPage,
    setIncludeIssued,

    // 데이터
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount: filteredProducts.length,

    // 로딩/에러
    isLoading,
    error,
  };
}
```

#### 5.2 useProduct (단일 조회)

```typescript
// src/hooks/product/useProduct.ts

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/types/product";
import { getProduct } from "@/api/product";
import { queryKeys } from "@/api/queryKeys";

interface UseProductOptions {
  productId: string;
}

export function useProduct({ productId }: UseProductOptions) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.detail(Number(productId)),
    queryFn: () => getProduct({ id: Number(productId) }),
    enabled: !!productId, // productId가 있을 때만 실행
    staleTime: 1000 * 60 * 10, // 10분 캐싱
  });

  return {
    product: product || null,
    isLoading,
    error,
  };
}
```

#### 5.3 useDashboard (복잡한 예시)

```typescript
// src/hooks/dashboard/useDashboard.ts

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ReportKPIs, ChartDataPoint } from "@/types/dashboard";
import { getDashboardKPIs, getChartData } from "@/api/dashboard";
import { queryKeys } from "@/api/queryKeys";

const dateRanges = ["오늘", "7일", "30일", "3개월", "6개월", "1년"];

interface UseDashboardOptions {
  initialDateRange?: string;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { initialDateRange = "30일" } = options;
  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);

  // ✅ React Query: KPI 조회
  const {
    data: kpis,
    isLoading: isLoadingKPIs,
  } = useQuery({
    queryKey: queryKeys.dashboard.kpis(selectedDateRange),
    queryFn: () => getDashboardKPIs({ dateRange: selectedDateRange }),
  });

  // ✅ React Query: 차트 데이터 조회
  const {
    data: chartData = [],
    isLoading: isLoadingChart,
  } = useQuery({
    queryKey: queryKeys.dashboard.chart(selectedDateRange),
    queryFn: () => getChartData({ dateRange: selectedDateRange }),
  });

  const isLoading = isLoadingKPIs || isLoadingChart;

  return {
    selectedDateRange,
    dateRanges,
    setSelectedDateRange,
    kpis: kpis || null,
    chartData,
    isLoading,
  };
}
```

#### 5.4 useLinks

```typescript
// src/hooks/link/useLinks.ts

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LinkRow, LinkPlatform, LinkStatus } from "@/types/link";
import { getLinks } from "@/api/link";
import { queryKeys } from "@/api/queryKeys";

export function useLinks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<LinkPlatform | "전체">("전체");
  const [selectedStatus, setSelectedStatus] = useState<LinkStatus | "전체">("전체");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ React Query: 링크 조회
  const {
    data: linksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.links.list({
      platform: selectedPlatform,
      status: selectedStatus,
      search: searchQuery,
    }),
    queryFn: () =>
      getLinks({
        platform: selectedPlatform === "전체" ? undefined : selectedPlatform,
        status: selectedStatus === "전체" ? undefined : selectedStatus,
        search: searchQuery || undefined,
      }),
  });

  const links = linksData?.links || [];

  // 페이지네이션
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(links.length / perPage));
  const paginatedLinks = useMemo(() => {
    return links.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [links, currentPage]);

  return {
    searchQuery,
    selectedPlatform,
    selectedStatus,
    currentPage,
    setSearchQuery,
    setSelectedPlatform,
    setSelectedStatus,
    setCurrentPage,
    links,
    paginatedLinks,
    totalPages,
    totalCount: links.length,
    isLoading,
    error,
  };
}
```

#### 5.5 간단한 Hook (QnA, Guide)

```typescript
// src/hooks/qna/useQnA.ts

import { useQuery } from "@tanstack/react-query";
import { getQnAItems } from "@/api/qna";
import { queryKeys } from "@/api/queryKeys";

export function useQnA() {
  const { data: qnaItems = [], isLoading } = useQuery({
    queryKey: queryKeys.qna.all,
    queryFn: getQnAItems,
    staleTime: 1000 * 60 * 10, // 10분 캐싱
  });

  return {
    qnaItems,
    isLoading,
  };
}
```

```typescript
// src/hooks/guide/useGuide.ts

import { useQuery } from "@tanstack/react-query";
import { getGuideSections } from "@/api/guide";
import { queryKeys } from "@/api/queryKeys";

export function useGuide() {
  const { data: guideSections = [], isLoading } = useQuery({
    queryKey: queryKeys.guide.all,
    queryFn: getGuideSections,
    staleTime: 1000 * 60 * 30, // 30분 캐싱 (가이드는 거의 변하지 않음)
  });

  return {
    guideSections,
    isLoading,
  };
}
```

---

## 🎨 고급 기능 활용

### Step 6: Prefetching (선택사항)

다음 페이지 미리 로드:

```typescript
// src/hooks/product/useProducts.ts

import { useQueryClient } from "@tanstack/react-query";

export function useProducts(options: UseProductsOptions = {}) {
  const queryClient = useQueryClient();

  // ... 기존 코드

  // 다음 페이지 prefetch
  useEffect(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({ page: currentPage + 1, perPage }),
        queryFn: () => getProducts({ page: currentPage + 1, perPage }),
      });
    }
  }, [currentPage, totalPages, perPage, queryClient]);

  // ...
}
```

### Step 7: Mutation (추후 추가 기능)

데이터 생성/수정/삭제 시 사용 (현재는 조회만):

```typescript
// src/hooks/product/useCreateLink.ts (예시)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "@/api/link";
import { queryKeys } from "@/api/queryKeys";

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      // 링크 목록 캐시 무효화 (자동 재요청)
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all });
    },
  });
}
```

---

## 🧪 테스트 체크리스트

### React Query 설정
- [ ] QueryClientProvider 설정 완료
- [ ] DevTools 개발 환경에서 표시
- [ ] 기본 staleTime, gcTime 설정 확인

### Query Key Factory
- [ ] 모든 도메인 Query Key 정의
- [ ] 타입 안전성 확인 (as const)

### Hook 리팩토링
- [ ] useProducts - useQuery 전환 완료
- [ ] useProduct - useQuery 전환 완료
- [ ] useDashboard - useQuery 전환 완료
- [ ] useLinks - useQuery 전환 완료
- [ ] useSettlement - useQuery 전환 완료
- [ ] useNotices - useQuery 전환 완료
- [ ] useQnA - useQuery 전환 완료
- [ ] useGuide - useQuery 전환 완료

### 페이지 동작 확인
- [ ] 모든 페이지 정상 렌더링
- [ ] 캐싱 동작 확인 (DevTools)
- [ ] 로딩 상태 표시 확인
- [ ] 에러 상태 표시 확인

---

## 🎁 React Query 이점

### 1. **자동 캐싱**
```typescript
// 같은 Query Key로 여러 번 호출해도 캐시 사용
const { data } = useQuery({ queryKey: queryKeys.products.all, ... });
```

### 2. **자동 재요청**
- Window Focus 시 (설정으로 비활성화 가능)
- 네트워크 재연결 시
- 일정 시간 후 (refetchInterval)

### 3. **로딩/에러 상태 자동 관리**
```typescript
const { data, isLoading, error } = useQuery({ ... });
```

### 4. **DevTools로 디버깅**
- 캐시 상태 확인
- Query 실행 이력
- 수동 refetch

### 5. **성능 최적화**
- 중복 요청 제거
- Background refetch
- Prefetching

---

## 🔄 롤백 전략

```bash
git add .
git commit -m "refactor(structure): complete phase 10 - introduce React Query"
```

문제 발생 시:
```bash
git revert HEAD
npm uninstall @tanstack/react-query @tanstack/react-query-devtools
```

---

## 📌 주의사항

### 1. **Query Key 일관성**
```typescript
// ✅ Factory 사용
queryKey: queryKeys.products.all

// ❌ 하드코딩 (캐시 키 불일치 위험)
queryKey: ["products"]
```

### 2. **staleTime vs gcTime**
- **staleTime**: 데이터가 "신선"한 시간 (재요청 안 함)
- **gcTime**: 캐시가 메모리에 유지되는 시간

### 3. **enabled 옵션 활용**
```typescript
// productId가 있을 때만 실행
enabled: !!productId
```

---

## 🎉 최종 구조

```
src/
├── api/                           # Phase 9
│   ├── client.ts
│   ├── queryKeys.ts               # Phase 10 (추가)
│   └── product/, dashboard/, ...
├── hooks/                         # Phase 8-10
│   ├── product/
│   │   ├── useProducts.ts         # React Query 사용
│   │   └── useProduct.ts          # React Query 사용
│   └── dashboard/, link/, ...
├── types/                         # Phase 5-7
├── data/
│   └── mockData.ts                # Phase 9 (API에서 사용)
├── components/
│   ├── common/                    # Phase 3
│   └── dashboard/, notice/, ...   # Phase 11+ (UI 분리)
└── app/
    ├── (marketing)/               # Phase 2
    └── (partners)/                # Phase 2
```

---

## 다음 단계 (선택사항)

### Phase 11: UI 컴포넌트 분리
- 페이지에서 UI 컴포넌트 추출
- components/dashboard/, components/notice/ 구현

### Phase 12: 실제 API 연동
- API 함수를 실제 HTTP 요청으로 전환
- 인증 토큰 처리
- 에러 핸들링 강화

### Phase 13: 성능 최적화
- React.memo, useMemo, useCallback
- Code splitting
- Image optimization
## 📝 Phase 완료 후 progress.md 업데이트

이 Phase 완료 후 **반드시** `docs/refactoring/progress.md`를 업데이트하세요:

```bash
# progress.md 열기
vi docs/refactoring/progress.md

# 또는
code docs/refactoring/progress.md
```

**업데이트 항목:**
1. Phase 진행 상황 테이블: 상태를 ✅ 완료로, 완료 날짜 기입
2. 체크포인트: 해당 Phase 체크포인트 항목 체크
3. Git 커밋 이력: 커밋 해시와 날짜 기록
4. 다음 작업: 완료된 작업 체크, 현재 Phase 갱신

---

