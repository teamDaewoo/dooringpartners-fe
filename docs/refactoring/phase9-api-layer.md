# Phase 9: API 계층 생성 (mockData → API 함수)

## 📋 개요

**목표**: mockData를 API 함수로 대체, React Query 도입 준비
**예상 시간**: 90-120분
**위험도**: 🟡 중간 (새로운 계층 추가)
**선행 작업**: Phase 8 완료
**후속 작업**: Phase 10 (React Query 도입)

---

## 🎯 목표

1. API 계층 생성 (`src/api/`)
2. mockData를 API 함수 형태로 래핑
3. Hook에서 mockData → API 함수 호출로 전환
4. 비동기 처리 구조 구축 (Promise 기반)
5. React Query 도입을 위한 인터페이스 표준화

---

## 📊 현재 구조 분석

### 현재 문제점

**useProducts.ts (Phase 8)**
```typescript
import { products as mockProducts, categories as mockCategories } from "@/data/mockData";

export function useProducts() {
  // ❌ 직접 mockData import
  const products = mockProducts;
  const categories = mockCategories;

  // ❌ 동기 처리
  const filteredProducts = useMemo(() => {
    return products.filter(...);
  }, [products, filters]);
}
```

**문제점**:
- mockData를 직접 import (실제 API로 전환 어려움)
- 동기 처리 (loading, error 상태 없음)
- React Query 전환 시 전면 수정 필요

---

## 🎨 목표 구조

### Phase 9 완료 후

**폴더 구조**
```
src/
├── api/
│   ├── client.ts                  # API 클라이언트 설정
│   ├── product/
│   │   ├── getProducts.ts         # 상품 목록 조회
│   │   ├── getProduct.ts          # 단일 상품 조회
│   │   └── getCategories.ts       # 카테고리 조회
│   ├── dashboard/
│   │   ├── getDashboardKPIs.ts    # KPI 조회
│   │   └── getChartData.ts        # 차트 데이터 조회
│   ├── link/
│   │   └── getLinks.ts            # 링크 목록 조회
│   ├── settlement/
│   │   ├── getSettlements.ts      # 정산 목록 조회
│   │   └── getSettlementKPIs.ts   # 정산 KPI 조회
│   ├── notice/
│   │   └── getNotices.ts          # 공지사항 조회
│   ├── qna/
│   │   └── getQnAItems.ts         # Q&A 조회
│   └── guide/
│       └── getGuideSections.ts    # 가이드 조회
```

**Hook 구조 (useProducts.ts)**
```typescript
import { getProducts, getCategories } from "@/api/product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... 필터링 로직
}
```

---

## 📝 작업 단계

### Step 1: API 클라이언트 설정

#### 1.1 기본 클라이언트 생성

```typescript
// src/api/client.ts

/**
 * API 클라이언트 설정
 * Phase 9: mockData를 Promise로 래핑
 * Phase 10+: 실제 HTTP 요청으로 전환
 */

// Mock delay 시뮬레이션 (실제 API 느낌)
const MOCK_DELAY = 300; // ms

export async function mockFetch<T>(data: T): Promise<T> {
  // 네트워크 딜레이 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // 5% 확률로 에러 발생 시뮬레이션 (선택사항)
  if (Math.random() < 0.05) {
    throw new Error("Mock API Error: Network request failed");
  }

  return data;
}

/**
 * Phase 10+에서 사용할 실제 API 클라이언트 (주석 처리)
 */
/*
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
*/
```

---

### Step 2: API 함수 구현

#### 2.1 Product API

```typescript
// src/api/product/getProducts.ts

import type { Product } from "@/types/product";
import { products as mockProducts } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
}

/**
 * 상품 목록 조회
 * Phase 9: mockData 래핑
 * Phase 10+: 실제 API 호출로 전환
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<GetProductsResponse> {
  // Phase 9: mockData 사용
  const allProducts = mockProducts;

  // 서버 사이드 필터링 시뮬레이션 (선택사항)
  let filtered = allProducts;
  if (params?.category && params.category !== "전체") {
    filtered = filtered.filter((p) => p.category === params.category);
  }
  if (params?.search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  // 페이지네이션
  const page = params?.page || 1;
  const perPage = params?.perPage || 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedProducts = filtered.slice(start, end);

  const response: GetProductsResponse = {
    products: paginatedProducts,
    total: filtered.length,
    page,
    perPage,
  };

  return mockFetch(response);

  /* Phase 10+: 실제 API
  return apiFetch<GetProductsResponse>('/api/products', {
    method: 'GET',
    params: new URLSearchParams(params as any),
  });
  */
}
```

```typescript
// src/api/product/getProduct.ts

import type { Product } from "@/types/product";
import { products as mockProducts } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetProductParams {
  id: number;
}

/**
 * 단일 상품 조회
 */
export async function getProduct({ id }: GetProductParams): Promise<Product | null> {
  const product = mockProducts.find((p) => p.id === id) || null;
  return mockFetch(product);

  /* Phase 10+: 실제 API
  return apiFetch<Product>(`/api/products/${id}`);
  */
}
```

```typescript
// src/api/product/getCategories.ts

import type { ProductCategory } from "@/types/product";
import { categories as mockCategories } from "@/data/mockData";
import { mockFetch } from "../client";

/**
 * 카테고리 목록 조회
 */
export async function getCategories(): Promise<ProductCategory[]> {
  return mockFetch(mockCategories);

  /* Phase 10+: 실제 API
  return apiFetch<ProductCategory[]>('/api/categories');
  */
}
```

#### 2.2 Dashboard API

```typescript
// src/api/dashboard/getDashboardKPIs.ts

import type { ReportKPIs } from "@/types/dashboard";
import { reportKPIs } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetDashboardKPIsParams {
  dateRange?: string; // "7일", "30일", etc.
}

/**
 * 대시보드 KPI 조회
 */
export async function getDashboardKPIs(
  params?: GetDashboardKPIsParams
): Promise<ReportKPIs> {
  // Phase 9: mockData (dateRange 무시)
  return mockFetch(reportKPIs);

  /* Phase 10+: 실제 API
  return apiFetch<ReportKPIs>('/api/dashboard/kpis', {
    params: new URLSearchParams(params as any),
  });
  */
}
```

```typescript
// src/api/dashboard/getChartData.ts

import type { ChartDataPoint } from "@/types/dashboard";
import { reportChartData } from "@/data/mockData";
import { mockFetch } from "../client";

export interface GetChartDataParams {
  dateRange?: string;
}

/**
 * 차트 데이터 조회
 */
export async function getChartData(
  params?: GetChartDataParams
): Promise<ChartDataPoint[]> {
  return mockFetch(reportChartData);

  /* Phase 10+: 실제 API
  return apiFetch<ChartDataPoint[]>('/api/dashboard/chart', {
    params: new URLSearchParams(params as any),
  });
  */
}
```

#### 2.3 Link API

```typescript
// src/api/link/getLinks.ts

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

/**
 * 링크 목록 조회
 */
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

#### 2.4 Settlement API

```typescript
// src/api/settlement/getSettlements.ts

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

/**
 * 정산 목록 조회
 */
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
// src/api/settlement/getSettlementKPIs.ts

import type { ReceiptKPIs } from "@/types/settlement";
import { receiptKPIs } from "@/data/mockData";
import { mockFetch } from "../client";

/**
 * 정산 KPI 조회
 */
export async function getSettlementKPIs(): Promise<ReceiptKPIs> {
  return mockFetch(receiptKPIs);
}
```

#### 2.5 Notice API

```typescript
// src/api/notice/getNotices.ts

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

/**
 * 공지사항 조회
 */
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

#### 2.6 QnA API

```typescript
// src/api/qna/getQnAItems.ts

import type { QnAItem } from "@/types/qna";
import { qnaItems } from "@/data/mockData";
import { mockFetch } from "../client";

/**
 * Q&A 목록 조회
 */
export async function getQnAItems(): Promise<QnAItem[]> {
  return mockFetch(qnaItems);
}
```

#### 2.7 Guide API

```typescript
// src/api/guide/getGuideSections.ts

import type { GuideSection } from "@/types/guide";
import { guideSections } from "@/data/mockData";
import { mockFetch } from "../client";

/**
 * 가이드 섹션 조회
 */
export async function getGuideSections(): Promise<GuideSection[]> {
  return mockFetch(guideSections);
}
```

---

### Step 3: Hook 리팩토링 (API 사용)

#### 3.1 useProducts 리팩토링

**변경 전 (Phase 8)**
```typescript
import { products as mockProducts, categories as mockCategories } from "@/data/mockData";

export function useProducts() {
  const products = mockProducts;
  const categories = mockCategories;
  // ...
}
```

**변경 후 (Phase 9)**
```typescript
import { useState, useEffect, useMemo } from "react";
import type { Product, ProductCategory } from "@/types/product";
import { getProducts, getCategories } from "@/api/product";

export function useProducts(options: UseProductsOptions = {}) {
  const { initialCategory = "전체", perPage = 6 } = options;

  // 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [includeIssued, setIncludeIssued] = useState(false);

  // 데이터 페칭
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

  // 클라이언트 사이드 필터링 (Phase 10에서 서버로 이동 가능)
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

  return {
    // 상태
    searchQuery,
    selectedCategory,
    currentPage,
    includeIssued,

    // 핸들러
    setSearchQuery,
    setSelectedCategory,
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

#### 3.2 useDashboard 리팩토링

```typescript
import { useState, useEffect } from "react";
import type { ReportKPIs, ChartDataPoint } from "@/types/dashboard";
import { getDashboardKPIs, getChartData } from "@/api/dashboard";

export function useDashboard(options: UseDashboardOptions = {}) {
  const { initialDateRange = "30일" } = options;

  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);
  const [kpis, setKpis] = useState<ReportKPIs | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [kpisData, chartDataRes] = await Promise.all([
          getDashboardKPIs({ dateRange: selectedDateRange }),
          getChartData({ dateRange: selectedDateRange }),
        ]);

        setKpis(kpisData);
        setChartData(chartDataRes);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDateRange]);

  return {
    selectedDateRange,
    dateRanges: ["오늘", "7일", "30일", "3개월", "6개월", "1년"],
    setSelectedDateRange,
    kpis,
    chartData,
    isLoading,
    error,
  };
}
```

---

### Step 4: 페이지 수정 (로딩/에러 처리)

#### 4.1 products/page.tsx

```typescript
import { useProducts } from "@/hooks/product/useProducts";

function ProductSearchPageContent() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    paginatedProducts,
    totalPages,
    totalCount,
    isLoading,
    error,
  } = useProducts({ perPage: 6 });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">데이터를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ... UI */}
    </div>
  );
}
```

---

## 🧪 테스트 체크리스트

### API 함수 테스트
- [ ] 모든 API 함수가 Promise를 반환
- [ ] 300ms 딜레이 동작 확인
- [ ] 에러 시뮬레이션 동작 (선택)

### Hook 테스트
- [ ] 초기 로딩 상태 = true
- [ ] 데이터 로드 후 isLoading = false
- [ ] 에러 발생 시 error 상태 설정

### 페이지 테스트
- [ ] 로딩 UI 표시
- [ ] 데이터 로드 후 정상 렌더링
- [ ] 에러 UI 표시 (에러 발생 시)

---

## 🎁 이점

### 1. **일관된 인터페이스**
모든 데이터 접근이 API 함수를 통해 이루어짐

### 2. **실제 API 전환 용이**
API 함수 내부만 수정하면 됨 (Hook, Page 변경 불필요)

### 3. **로딩/에러 처리 구조**
비동기 상태 관리 기반 마련

### 4. **React Query 도입 준비 완료**
Phase 10에서 Hook 내부만 수정

---

## 🔄 롤백 전략

각 API 도메인별 커밋:
```bash
git add src/api/product/
git commit -m "refactor(api): add product API functions"

git add src/api/dashboard/
git commit -m "refactor(api): add dashboard API functions"

# ... 반복

git add .
git commit -m "refactor(structure): complete phase 9 - create API layer"
```

---

## 다음 단계

Phase 9 완료 후:
- **Phase 10**: React Query 도입 (캐싱, 자동 재요청, 낙관적 업데이트)
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

