# Phase 8: React Query 기반 Hook 구현

## 📋 개요

**목표**: React Query를 활용한 서버 상태 관리 및 비즈니스 로직 분리
**예상 시간**: 180-200분 (3-3.5시간)
**위험도**: 🟡 중간 (새로운 라이브러리 + 계층 분리)
**선행 작업**: Phase 7 완료
**후속 작업**: 없음 (최종 단계)

---

## 🎯 목표

1. React Query 라이브러리 설치 및 설정
2. API 계층 생성 (mockData → API 함수)
3. Query Key Factory 구현
4. Hook 계층 생성 (useQuery 기반)
5. 페이지에서 비즈니스 로직 분리

---

## 📦 Step 1: React Query 설치 및 설정 (10-15분)

### 1.1 라이브러리 설치

```bash
npm install @tanstack/react-query@^5.0.0
npm install @tanstack/react-query-devtools@^5.0.0
```

### 1.2 QueryClient 설정

```typescript
// src/lib/queryClient.ts (생성)

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10,   // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 1.3 Provider 설정

```typescript
// src/app/layout.tsx (수정)

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
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

**커밋:**
```bash
git add .
git commit -m "feat: install and setup React Query"
```

---

## 📝 Step 2: API 계층 생성 (90-120분)

### 2.1 API 클라이언트 설정

```typescript
// src/api/client.ts (생성)

const MOCK_DELAY = 300; // ms

export async function mockFetch<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // 5% 확률로 에러 시뮬레이션 (선택)
  if (Math.random() < 0.05) {
    throw new Error("Mock API Error");
  }

  return data;
}
```

### 2.2 Query Key Factory

```typescript
// src/api/queryKeys.ts (생성)

export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },

  categories: {
    all: ["categories"] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    kpis: (dateRange: string) => [...queryKeys.dashboard.all, "kpis", dateRange] as const,
    chart: (dateRange: string) => [...queryKeys.dashboard.all, "chart", dateRange] as const,
  },

  links: {
    all: ["links"] as const,
    lists: () => [...queryKeys.links.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.links.lists(), filters] as const,
  },

  settlements: {
    all: ["settlements"] as const,
    kpis: () => [...queryKeys.settlements.all, "kpis"] as const,
    lists: () => [...queryKeys.settlements.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.settlements.lists(), filters] as const,
  },

  notices: {
    all: ["notices"] as const,
    lists: () => [...queryKeys.notices.all, "list"] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.notices.lists(), filters] as const,
  },

  qna: {
    all: ["qna"] as const,
  },

  guide: {
    all: ["guide"] as const,
  },
} as const;
```

**커밋:**
```bash
git add src/api/client.ts src/api/queryKeys.ts
git commit -m "feat: add API client and Query Key Factory"
```

### 2.3 도메인별 API 함수 구현

#### Product API

```typescript
// src/api/product/getProducts.ts (생성)

import type { Product } from "@/types/product";
import { products as mockProducts } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetProductsParams {
  category?: string;
  search?: string;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

export async function getProducts(
  params?: GetProductsParams
): Promise<GetProductsResponse> {
  let filtered = mockProducts;

  if (params?.category && params.category !== "전체") {
    filtered = filtered.filter((p) => p.category === params.category);
  }
  if (params?.search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  return mockFetch({ products: filtered, total: filtered.length });
}
```

```typescript
// src/api/product/getProduct.ts (생성)

import type { Product } from "@/types/product";
import { products as mockProducts } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getProduct(id: number): Promise<Product | null> {
  const product = mockProducts.find((p) => p.id === id) || null;
  return mockFetch(product);
}
```

```typescript
// src/api/product/getCategories.ts (생성)

import type { ProductCategory } from "@/types/product";
import { categories as mockCategories } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getCategories(): Promise<ProductCategory[]> {
  return mockFetch(mockCategories);
}
```

#### Dashboard API

```typescript
// src/api/dashboard/getDashboardKPIs.ts (생성)

import type { ReportKPIs } from "@/types/dashboard";
import { reportKPIs } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getDashboardKPIs(): Promise<ReportKPIs> {
  return mockFetch(reportKPIs);
}
```

```typescript
// src/api/dashboard/getChartData.ts (생성)

import type { ChartDataPoint } from "@/types/dashboard";
import { reportChartData } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getChartData(): Promise<ChartDataPoint[]> {
  return mockFetch(reportChartData);
}
```

#### Link API

```typescript
// src/api/link/getLinks.ts (생성)

import type { LinkRow } from "@/types/link";
import { linksData } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetLinksParams {
  platform?: string;
  status?: string;
  search?: string;
}

export interface GetLinksResponse {
  links: LinkRow[];
  total: number;
}

export async function getLinks(params?: GetLinksParams): Promise<GetLinksResponse> {
  let filtered = linksData;

  if (params?.platform && params.platform !== "전체") {
    filtered = filtered.filter((l) => l.platform === params.platform);
  }
  if (params?.status && params.status !== "전체") {
    filtered = filtered.filter((l) => l.status === params.status);
  }
  if (params?.search) {
    filtered = filtered.filter((l) =>
      l.title.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  return mockFetch({ links: filtered, total: filtered.length });
}
```

#### Settlement API

```typescript
// src/api/settlement/getSettlements.ts (생성)

import type { SettlementRow } from "@/types/settlement";
import { settlementData } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetSettlementsParams {
  status?: string;
}

export interface GetSettlementsResponse {
  settlements: SettlementRow[];
  total: number;
}

export async function getSettlements(
  params?: GetSettlementsParams
): Promise<GetSettlementsResponse> {
  let filtered = settlementData;

  if (params?.status && params.status !== "전체") {
    filtered = filtered.filter((s) => s.status === params.status);
  }

  return mockFetch({ settlements: filtered, total: filtered.length });
}
```

```typescript
// src/api/settlement/getSettlementKPIs.ts (생성)

import type { ReceiptKPIs } from "@/types/settlement";
import { receiptKPIs } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getSettlementKPIs(): Promise<ReceiptKPIs> {
  return mockFetch(receiptKPIs);
}
```

#### Notice API

```typescript
// src/api/notice/getNotices.ts (생성)

import type { Notice } from "@/types/notice";
import { notices } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetNoticesParams {
  category?: string;
}

export interface GetNoticesResponse {
  notices: Notice[];
  total: number;
}

export async function getNotices(
  params?: GetNoticesParams
): Promise<GetNoticesResponse> {
  let filtered = notices;

  if (params?.category && params.category !== "전체") {
    filtered = filtered.filter((n) => n.category === params.category);
  }

  return mockFetch({ notices: filtered, total: filtered.length });
}
```

#### QnA API

```typescript
// src/api/qna/getQnAItems.ts (생성)

import type { QnAItem } from "@/types/qna";
import { qnaItems } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getQnAItems(): Promise<QnAItem[]> {
  return mockFetch(qnaItems);
}
```

#### Guide API

```typescript
// src/api/guide/getGuideSections.ts (생성)

import type { GuideSection } from "@/types/guide";
import { guideSections } from "@/data/mockData";
import { mockFetch } from "../client";

export async function getGuideSections(): Promise<GuideSection[]> {
  return mockFetch(guideSections);
}
```

**커밋 (도메인별로):**
```bash
git add src/api/product/
git commit -m "feat: implement product API functions"

git add src/api/dashboard/
git commit -m "feat: implement dashboard API functions"

git add src/api/link/
git commit -m "feat: implement link API functions"

git add src/api/settlement/
git commit -m "feat: implement settlement API functions"

git add src/api/notice/
git commit -m "feat: implement notice API functions"

git add src/api/qna/ src/api/guide/
git commit -m "feat: implement qna and guide API functions"
```

---

## 🔧 Step 3: React Query 기반 Hook 구현 (60-80분)

### 3.1 useProducts (복잡한 예시)

```typescript
// src/hooks/product/useProducts.ts (생성)

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [includeIssued, setIncludeIssued] = useState(false);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: queryKeys.products.list({ page: currentPage, perPage }),
    queryFn: () => getProducts({ category: selectedCategory, search: searchQuery }),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,
  });

  const products = productsData?.products || [];
  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError;

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    selectedCategory,
    currentPage,
    includeIssued,
    setSearchQuery: handleSearchChange,
    setSelectedCategory: handleCategoryChange,
    setCurrentPage,
    setIncludeIssued,
    products,
    categories,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount: filteredProducts.length,
    isLoading,
    error,
  };
}
```

### 3.2 useProduct (단일 조회)

```typescript
// src/hooks/product/useProduct.ts (생성)

import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/api/product";
import { queryKeys } from "@/api/queryKeys";

export function useProduct(productId: string) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.detail(Number(productId)),
    queryFn: () => getProduct(Number(productId)),
    enabled: !!productId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    product: product || null,
    isLoading,
    error,
  };
}
```

### 3.3 useDashboard

```typescript
// src/hooks/dashboard/useDashboard.ts (생성)

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardKPIs, getChartData } from "@/api/dashboard";
import { queryKeys } from "@/api/queryKeys";

const dateRanges = ["오늘", "7일", "30일", "3개월", "6개월", "1년"];

export function useDashboard(initialDateRange = "30일") {
  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);

  const { data: kpis, isLoading: isLoadingKPIs } = useQuery({
    queryKey: queryKeys.dashboard.kpis(selectedDateRange),
    queryFn: getDashboardKPIs,
  });

  const { data: chartData = [], isLoading: isLoadingChart } = useQuery({
    queryKey: queryKeys.dashboard.chart(selectedDateRange),
    queryFn: getChartData,
  });

  return {
    selectedDateRange,
    dateRanges,
    setSelectedDateRange,
    kpis: kpis || null,
    chartData,
    isLoading: isLoadingKPIs || isLoadingChart,
  };
}
```

### 3.4 useLinks

```typescript
// src/hooks/link/useLinks.ts (생성)

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LinkPlatform, LinkStatus } from "@/types/link";
import { getLinks } from "@/api/link";
import { queryKeys } from "@/api/queryKeys";

export function useLinks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<LinkPlatform | "전체">("전체");
  const [selectedStatus, setSelectedStatus] = useState<LinkStatus | "전체">("전체");
  const [currentPage, setCurrentPage] = useState(1);

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

### 3.5 useSettlement

```typescript
// src/hooks/settlement/useSettlement.ts (생성)

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SettlementStatus } from "@/types/settlement";
import { getSettlements, getSettlementKPIs } from "@/api/settlement";
import { queryKeys } from "@/api/queryKeys";

export function useSettlement() {
  const [selectedStatus, setSelectedStatus] = useState<SettlementStatus | "전체">("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: kpis } = useQuery({
    queryKey: queryKeys.settlements.kpis(),
    queryFn: getSettlementKPIs,
  });

  const {
    data: settlementsData,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.settlements.list({ status: selectedStatus }),
    queryFn: () =>
      getSettlements({
        status: selectedStatus === "전체" ? undefined : selectedStatus,
      }),
  });

  const settlements = settlementsData?.settlements || [];
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(settlements.length / perPage));
  const paginatedSettlements = useMemo(() => {
    return settlements.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [settlements, currentPage]);

  return {
    selectedStatus,
    currentPage,
    setSelectedStatus,
    setCurrentPage,
    kpis: kpis || null,
    settlements,
    paginatedSettlements,
    totalPages,
    isLoading,
  };
}
```

### 3.6 useNotices

```typescript
// src/hooks/notice/useNotices.ts (생성)

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { NoticeCategory } from "@/types/notice";
import { getNotices } from "@/api/notice";
import { queryKeys } from "@/api/queryKeys";

export function useNotices(perPage = 10) {
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | "전체">("전체");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: noticesData,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.notices.list({ category: selectedCategory }),
    queryFn: () =>
      getNotices({
        category: selectedCategory === "전체" ? undefined : selectedCategory,
      }),
  });

  const notices = noticesData?.notices || [];
  const totalPages = Math.max(1, Math.ceil(notices.length / perPage));
  const paginatedNotices = useMemo(() => {
    return notices.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [notices, currentPage, perPage]);

  return {
    selectedCategory,
    currentPage,
    setSelectedCategory,
    setCurrentPage,
    notices,
    paginatedNotices,
    totalPages,
    isLoading,
  };
}
```

### 3.7 useQnA

```typescript
// src/hooks/qna/useQnA.ts (생성)

import { useQuery } from "@tanstack/react-query";
import { getQnAItems } from "@/api/qna";
import { queryKeys } from "@/api/queryKeys";

export function useQnA() {
  const { data: qnaItems = [], isLoading } = useQuery({
    queryKey: queryKeys.qna.all,
    queryFn: getQnAItems,
    staleTime: 1000 * 60 * 10,
  });

  return {
    qnaItems,
    isLoading,
  };
}
```

### 3.8 useGuide

```typescript
// src/hooks/guide/useGuide.ts (생성)

import { useQuery } from "@tanstack/react-query";
import { getGuideSections } from "@/api/guide";
import { queryKeys } from "@/api/queryKeys";

export function useGuide() {
  const { data: guideSections = [], isLoading } = useQuery({
    queryKey: queryKeys.guide.all,
    queryFn: getGuideSections,
    staleTime: 1000 * 60 * 30,
  });

  return {
    guideSections,
    isLoading,
  };
}
```

**커밋 (도메인별로):**
```bash
git add src/hooks/product/
git commit -m "feat: implement useProducts and useProduct hooks"

git add src/hooks/dashboard/
git commit -m "feat: implement useDashboard hook"

git add src/hooks/link/
git commit -m "feat: implement useLinks hook"

git add src/hooks/settlement/
git commit -m "feat: implement useSettlement hook"

git add src/hooks/notice/
git commit -m "feat: implement useNotices hook"

git add src/hooks/qna/ src/hooks/guide/
git commit -m "feat: implement useQnA and useGuide hooks"
```

---

## 🎨 Step 4: 페이지 리팩토링 (30-40분)

### 4.1 products/page.tsx

```typescript
// src/app/(partners)/products/page.tsx

'use client';

import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Product } from "@/types/product";
import { useProducts } from "@/hooks/product/useProducts";

function formatKRW(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function ProductSearchPageContent() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    includeIssued,
    setIncludeIssued,
    categories,
    paginatedProducts,
    totalPages,
    totalCount,
    isLoading,
  } = useProducts({ perPage: 6 });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-foreground mb-4">상품 둘러보기</h1>

      {/* Search */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="상품명을 검색하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <Button size="sm">검색</Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <h3 className="text-sm font-semibold mb-3">카테고리</h3>
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2 py-1">
                <RadioGroupItem value={cat} id={`cat-${cat}`} />
                <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              검색결과 <span className="font-medium text-foreground">{totalCount}</span>개
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="include-issued" className="text-xs text-muted-foreground">
                발급된 링크 포함
              </Label>
              <Switch
                id="include-issued"
                checked={includeIssued}
                onCheckedChange={setIncludeIssued}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalCount === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              검색 결과가 없습니다.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span className="text-muted-foreground text-xs">상품 이미지</span>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {product.campaignStart} ~ {product.campaignEnd}
          </p>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">커미션 {product.commissionRate}%</span>
            <span className="text-sm font-bold text-accent">
              {formatKRW(product.commissionAmount)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default function ProductSearchPage() {
  return <ProductSearchPageContent />;
}
```

### 4.2 dashboard/page.tsx

```typescript
// src/app/(partners)/dashboard/page.tsx

'use client';

import { Search, MousePointerClick, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "@/components/common/KPICard";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

export default function DashboardPage() {
  const {
    selectedDateRange,
    dateRanges,
    setSelectedDateRange,
    kpis,
    chartData,
    isLoading,
  } = useDashboard();

  if (isLoading || !kpis) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-1">
        <h1 className="text-xl font-bold text-foreground">실적 리포트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          등록한 상품별 실적을 확인하고 분석하세요.
        </p>
      </div>

      {/* Date chips */}
      <div className="flex gap-2 mb-6 mt-4">
        {dateRanges.map((range) => (
          <Button
            key={range}
            size="sm"
            variant={selectedDateRange === range ? "default" : "outline"}
            onClick={() => setSelectedDateRange(range)}
            className="text-xs h-8"
          >
            {range}
          </Button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="건당 커미션"
          value={`₩${kpis.commissionPerUnit.toLocaleString()}`}
          change="평균 기준"
          changeType="neutral"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="클릭수"
          value={kpis.clicks.toLocaleString()}
          change="지난 기간 대비 +5.2%"
          changeType="positive"
          icon={<MousePointerClick className="h-4 w-4" />}
        />
        <KPICard
          title="구매수"
          value={kpis.purchases.toLocaleString()}
          change="지난 기간 대비 +3.8%"
          changeType="positive"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <KPICard
          title="전환율"
          value={`${kpis.conversionRate}%`}
          change="지난 기간 대비 -0.1%"
          changeType="negative"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">기간별 실적</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversion">
            <TabsList className="mb-4">
              <TabsTrigger value="conversion" className="text-xs">전환율</TabsTrigger>
              <TabsTrigger value="purchases" className="text-xs">구매수</TabsTrigger>
              <TabsTrigger value="clicks" className="text-xs">클릭수</TabsTrigger>
            </TabsList>
            <TabsContent value="conversion">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "전환율"]} />
                  <Bar dataKey="conversionRate" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="purchases">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}건`, "구매"]} />
                  <Bar dataKey="purchases" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="clicks">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}회`, "클릭"]} />
                  <Bar dataKey="clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
```

**커밋:**
```bash
git add src/app/(partners)/products/page.tsx
git commit -m "refactor: migrate products page to useProducts hook"

git add src/app/(partners)/dashboard/page.tsx
git commit -m "refactor: migrate dashboard page to useDashboard hook"

# 나머지 페이지도 동일하게...
git add src/app/(partners)/links/page.tsx
git commit -m "refactor: migrate links page to useLinks hook"

git add src/app/(partners)/receipt/page.tsx
git commit -m "refactor: migrate receipt page to useSettlement hook"

git add src/app/(partners)/notice/page.tsx
git commit -m "refactor: migrate notice page to useNotices hook"

git add src/app/(partners)/qna/page.tsx
git commit -m "refactor: migrate qna page to useQnA hook"

git add src/app/(partners)/guide/page.tsx
git commit -m "refactor: migrate guide page to useGuide hook"
```

---

## 🧪 검증 및 테스트

### 빌드 확인
```bash
npm run build
```

### DevTools 확인
1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 React Query DevTools 확인
3. 각 페이지 접속하여 캐싱 동작 확인

### 체크리스트
- [ ] React Query 설치 완료
- [ ] QueryClient 설정 완료
- [ ] Query Key Factory 구현
- [ ] 8개 도메인 API 함수 구현
- [ ] 8개 도메인 Hook 구현
- [ ] 모든 페이지 Hook 연결
- [ ] 빌드 성공
- [ ] DevTools 정상 동작
- [ ] 캐싱 동작 확인

---

## 📝 Phase 완료 후 progress.md 업데이트

이 Phase 완료 후 **반드시** `docs/refactoring/progress.md`를 업데이트하세요:

```bash
code docs/refactoring/progress.md
```

**업데이트 항목:**
1. Phase 진행 상황 테이블: 상태를 ✅ 완료로, 완료 날짜 기입
2. 체크포인트: 해당 Phase 체크포인트 항목 체크
3. Git 커밋 이력: 커밋 해시와 날짜 기록
4. 다음 작업: 완료된 작업 체크, 현재 Phase 갱신

---

## 🎁 최종 구조

```
src/
├── api/
│   ├── client.ts
│   ├── queryKeys.ts
│   ├── product/
│   │   ├── getProducts.ts
│   │   ├── getProduct.ts
│   │   └── getCategories.ts
│   ├── dashboard/
│   ├── link/
│   ├── settlement/
│   ├── notice/
│   ├── qna/
│   └── guide/
├── hooks/
│   ├── product/
│   │   ├── useProducts.ts
│   │   └── useProduct.ts
│   ├── dashboard/
│   ├── link/
│   ├── settlement/
│   ├── notice/
│   ├── qna/
│   └── guide/
├── lib/
│   └── queryClient.ts
└── app/
    └── (partners)/
        ├── products/page.tsx (Hook 사용)
        ├── dashboard/page.tsx (Hook 사용)
        └── ...
```

---

## 다음 단계 (선택사항)

Phase 8 완료 후 추가 개선:
- UI 컴포넌트 분리
- 실제 API 연동
- 성능 최적화
