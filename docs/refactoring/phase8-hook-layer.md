# Phase 8: Hook 계층 분리 (비즈니스 로직 추출)

## 📋 개요

**목표**: 페이지에서 비즈니스 로직을 Custom Hook으로 분리
**예상 시간**: 60-90분
**위험도**: 🟡 중간 (로직 분리 및 상태 관리)
**선행 작업**: Phase 7 완료
**후속 작업**: Phase 9 (API 계층 생성)

---

## 🎯 목표

1. 페이지의 상태 관리 로직을 Custom Hook으로 추출
2. 필터링, 페이지네이션, 정렬 등 비즈니스 로직 분리
3. 페이지는 UI 렌더링만 담당
4. React Query 도입을 위한 hook 구조 사전 구축

---

## 📊 현재 구조 분석

### 현재 문제점

**products/page.tsx 분석**
```typescript
function ProductSearchPageContent() {
  // ❌ 상태 관리 (페이지에 있음)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [includeIssued, setIncludeIssued] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ❌ 비즈니스 로직 (페이지에 있음)
  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ❌ UI 렌더링 (170줄)
  return <div>...</div>
}
```

**문제점**:
- 상태 관리, 비즈니스 로직, UI가 한 파일에 혼재
- 테스트 어려움
- 재사용 불가능
- React Query로 전환 시 전면 수정 필요

---

## 🎨 목표 구조

### Phase 8 완료 후

**폴더 구조**
```
src/
├── hooks/
│   ├── product/
│   │   ├── useProducts.ts         # 상품 목록 + 필터링 + 페이지네이션
│   │   └── useProduct.ts          # 단일 상품 조회
│   ├── link/
│   │   └── useLinks.ts            # 링크 목록 + 필터링
│   ├── dashboard/
│   │   └── useDashboard.ts        # 대시보드 KPI + 차트 데이터
│   ├── settlement/
│   │   └── useSettlement.ts       # 정산 데이터
│   ├── notice/
│   │   └── useNotices.ts          # 공지사항 목록 + 필터링
│   ├── qna/
│   │   └── useQnA.ts              # Q&A 목록
│   └── guide/
│       └── useGuide.ts            # 가이드 데이터
```

**페이지 구조 (products/page.tsx 예시)**
```typescript
import { useProducts } from "@/hooks/product/useProducts";

function ProductSearchPageContent() {
  // ✅ Hook에서 모든 로직 가져오기
  const {
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
    // 계산된 데이터
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalCount,
  } = useProducts();

  // ✅ UI 렌더링만 담당
  return <div>...</div>
}
```

---

## 📝 작업 단계

### Step 1: Hook 구조 설계

각 도메인별로 필요한 Hook 분석:

#### 1.1 Products (상품)

**useProducts.ts** - 상품 목록 페이지
```typescript
interface UseProductsOptions {
  initialCategory?: string;
  perPage?: number;
}

interface UseProductsReturn {
  // 상태
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  includeIssued: boolean;

  // 핸들러
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  setIncludeIssued: (include: boolean) => void;

  // 데이터
  products: Product[];
  categories: ProductCategory[];
  filteredProducts: Product[];
  paginatedProducts: Product[];
  totalPages: number;
  totalCount: number;
}
```

**useProduct.ts** - 상품 상세 페이지
```typescript
interface UseProductOptions {
  productId: string;
}

interface UseProductReturn {
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
}
```

#### 1.2 Dashboard (대시보드)

**useDashboard.ts**
```typescript
interface UseDashboardOptions {
  dateRange?: string; // "7일", "30일" 등
}

interface UseDashboardReturn {
  // 상태
  selectedDateRange: string;
  setSelectedDateRange: (range: string) => void;

  // 데이터
  kpis: ReportKPIs;
  chartData: ChartDataPoint[];
  isLoading: boolean;
}
```

#### 1.3 Links (링크 관리)

**useLinks.ts**
```typescript
interface UseLinksOptions {
  initialFilters?: {
    platform?: LinkPlatform;
    status?: LinkStatus;
  };
}

interface UseLinksReturn {
  // 상태
  searchQuery: string;
  selectedPlatform: LinkPlatform | "전체";
  selectedStatus: LinkStatus | "전체";
  currentPage: number;

  // 핸들러
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: LinkPlatform | "전체") => void;
  setSelectedStatus: (status: LinkStatus | "전체") => void;
  setCurrentPage: (page: number) => void;

  // 데이터
  links: LinkRow[];
  filteredLinks: LinkRow[];
  paginatedLinks: LinkRow[];
  totalPages: number;
  totalCount: number;
}
```

#### 1.4 Settlement (정산)

**useSettlement.ts**
```typescript
interface UseSettlementOptions {
  initialStatus?: SettlementStatus;
}

interface UseSettlementReturn {
  // 상태
  selectedStatus: SettlementStatus | "전체";
  currentPage: number;

  // 핸들러
  setSelectedStatus: (status: SettlementStatus | "전체") => void;
  setCurrentPage: (page: number) => void;

  // 데이터
  kpis: ReceiptKPIs;
  settlements: SettlementRow[];
  filteredSettlements: SettlementRow[];
  paginatedSettlements: SettlementRow[];
  totalPages: number;
}
```

#### 1.5 Notice (공지사항)

**useNotices.ts**
```typescript
interface UseNoticesOptions {
  perPage?: number;
}

interface UseNoticesReturn {
  // 상태
  selectedCategory: NoticeCategory | "전체";
  currentPage: number;

  // 핸들러
  setSelectedCategory: (category: NoticeCategory | "전체") => void;
  setCurrentPage: (page: number) => void;

  // 데이터
  notices: Notice[];
  filteredNotices: Notice[];
  paginatedNotices: Notice[];
  totalPages: number;
}
```

#### 1.6 QnA

**useQnA.ts**
```typescript
interface UseQnAReturn {
  // 데이터 (필터링 없음, 단순 조회)
  qnaItems: QnAItem[];
  isLoading: boolean;
}
```

#### 1.7 Guide (가이드)

**useGuide.ts**
```typescript
interface UseGuideReturn {
  // 데이터 (필터링 없음, 단순 조회)
  guideSections: GuideSection[];
  isLoading: boolean;
}
```

---

### Step 2: Hook 구현 순서

복잡도 순으로 작업:

1. **🟢 간단한 Hook부터** (QnA, Guide)
2. **🟡 중간 복잡도** (Dashboard, Settlement)
3. **🔴 복잡한 Hook** (Products, Links, Notice)

---

### Step 3: Hook 구현 예시

#### 3.1 useProducts.ts (전체 구현)

```typescript
// src/hooks/product/useProducts.ts

import { useState, useMemo } from "react";
import type { Product, ProductCategory } from "@/types/product";
import { products as mockProducts, categories as mockCategories } from "@/data/mockData";

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

  // 데이터 (Phase 9에서 API로 대체)
  const products = mockProducts;
  const categories = mockCategories;

  // 필터링 로직
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // 페이지네이션 로직
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * perPage, currentPage * perPage);
  }, [filteredProducts, currentPage, perPage]);

  // 카테고리 변경 시 페이지 리셋
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 검색어 변경 시 페이지 리셋
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
  };
}
```

#### 3.2 useProduct.ts (단일 상품)

```typescript
// src/hooks/product/useProduct.ts

import { useMemo } from "react";
import type { Product } from "@/types/product";
import { products as mockProducts } from "@/data/mockData";

interface UseProductOptions {
  productId: string;
}

export function useProduct({ productId }: UseProductOptions) {
  // 데이터 (Phase 9에서 API로 대체)
  const product = useMemo(() => {
    return mockProducts.find((p) => p.id === Number(productId)) || null;
  }, [productId]);

  return {
    product,
    isLoading: false, // Phase 9에서 실제 로딩 상태
    error: null,      // Phase 9에서 실제 에러 처리
  };
}
```

#### 3.3 useDashboard.ts

```typescript
// src/hooks/dashboard/useDashboard.ts

import { useState, useMemo } from "react";
import type { ReportKPIs, ChartDataPoint } from "@/types/dashboard";
import { reportKPIs, reportChartData } from "@/data/mockData";

const dateRanges = ["오늘", "7일", "30일", "3개월", "6개월", "1년"];

interface UseDashboardOptions {
  initialDateRange?: string;
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { initialDateRange = "30일" } = options;

  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);

  // 데이터 (Phase 9에서 API로 대체, dateRange 기반 필터링)
  const kpis = reportKPIs;
  const chartData = reportChartData;

  return {
    // 상태
    selectedDateRange,
    dateRanges,
    setSelectedDateRange,

    // 데이터
    kpis,
    chartData,
    isLoading: false,
  };
}
```

#### 3.4 useQnA.ts (간단한 예시)

```typescript
// src/hooks/qna/useQnA.ts

import type { QnAItem } from "@/types/qna";
import { qnaItems as mockQnAItems } from "@/data/mockData";

export function useQnA() {
  // Phase 9에서 API로 대체
  const qnaItems = mockQnAItems;

  return {
    qnaItems,
    isLoading: false,
  };
}
```

---

### Step 4: 페이지 리팩토링

#### 4.1 products/page.tsx 리팩토링

**변경 전 (170줄)**
```typescript
function ProductSearchPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [includeIssued, setIncludeIssued] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === "전체" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    // ... 150줄 UI 코드
  );
}
```

**변경 후 (80줄)**
```typescript
import { useProducts } from "@/hooks/product/useProducts";

function ProductSearchPageContent() {
  const {
    searchQuery,
    selectedCategory,
    currentPage,
    includeIssued,
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
    setIncludeIssued,
    categories,
    paginatedProducts,
    totalPages,
    totalCount,
  } = useProducts({ perPage: 6 });

  return (
    // ... UI 코드만 (비즈니스 로직 제거)
  );
}
```

#### 4.2 dashboard/page.tsx 리팩토링

**변경 전**
```typescript
const [selectedChip, setSelectedChip] = useState("30일");
const [searchQuery, setSearchQuery] = useState("");
```

**변경 후**
```typescript
import { useDashboard } from "@/hooks/dashboard/useDashboard";

const { selectedDateRange, dateRanges, setSelectedDateRange, kpis, chartData } = useDashboard();
```

---

### Step 5: 전체 Hook 목록

| Hook | 파일 경로 | 주요 기능 | 복잡도 |
|------|----------|----------|--------|
| useProducts | hooks/product/useProducts.ts | 필터링, 페이지네이션 | 🔴 높음 |
| useProduct | hooks/product/useProduct.ts | 단일 상품 조회 | 🟢 낮음 |
| useDashboard | hooks/dashboard/useDashboard.ts | KPI, 차트, 날짜 필터 | 🟡 중간 |
| useLinks | hooks/link/useLinks.ts | 필터링, 페이지네이션 | 🔴 높음 |
| useSettlement | hooks/settlement/useSettlement.ts | 필터링, 페이지네이션 | 🟡 중간 |
| useNotices | hooks/notice/useNotices.ts | 카테고리 필터, 페이지네이션 | 🟡 중간 |
| useQnA | hooks/qna/useQnA.ts | 단순 데이터 조회 | 🟢 낮음 |
| useGuide | hooks/guide/useGuide.ts | 단순 데이터 조회 | 🟢 낮음 |

---

## 🧪 테스트 체크리스트

각 Hook 구현 후:

### 단위 테스트 (선택)
- [ ] Hook의 상태 변화 테스트
- [ ] 필터링 로직 테스트
- [ ] 페이지네이션 계산 테스트

### 통합 테스트
- [ ] 각 페이지 정상 렌더링
- [ ] 필터링 동작 확인
- [ ] 페이지네이션 동작 확인
- [ ] 검색 기능 동작 확인

### 페이지별 체크리스트
- [ ] `/products` - 카테고리 필터, 검색, 페이지네이션
- [ ] `/products/1` - 상품 상세 조회
- [ ] `/dashboard` - 날짜 필터, KPI, 차트
- [ ] `/links` - 플랫폼/상태 필터, 페이지네이션
- [ ] `/receipt` - 상태 필터, 페이지네이션
- [ ] `/notice` - 카테고리 필터, 페이지네이션
- [ ] `/qna` - 데이터 표시
- [ ] `/guide` - 데이터 표시

---

## 🎁 이점

### 1. **관심사의 분리**
```typescript
// ✅ 페이지: UI만
// ✅ Hook: 비즈니스 로직만
```

### 2. **재사용성**
```typescript
// 다른 곳에서도 동일한 hook 사용 가능
const { filteredProducts } = useProducts();
```

### 3. **테스트 용이성**
```typescript
// Hook만 독립적으로 테스트 가능
import { renderHook } from "@testing-library/react-hooks";
const { result } = renderHook(() => useProducts());
```

### 4. **React Query 전환 준비**
```typescript
// Phase 9-10: Hook 내부만 수정하면 됨
export function useProducts() {
  // ❌ const products = mockProducts;
  // ✅ const { data: products } = useQuery({ ... });
}
```

---

## 🔄 롤백 전략

각 Hook 완료 시마다 커밋:
```bash
git add src/hooks/product/
git commit -m "refactor(hooks): add useProducts and useProduct hooks"

git add src/hooks/dashboard/
git commit -m "refactor(hooks): add useDashboard hook"

# ... 반복
```

전체 완료 후:
```bash
git add .
git commit -m "refactor(structure): complete phase 8 - extract business logic to hooks"
```

---

## 📌 주의사항

### 1. **useMemo 적절히 사용**
```typescript
// ✅ 계산 비용이 높은 연산
const filtered = useMemo(() => {
  return products.filter(...);
}, [products, filters]);

// ❌ 단순 값은 useMemo 불필요
const count = filteredProducts.length; // useMemo 불필요
```

### 2. **Hook 네이밍**
- `use` prefix 필수
- 도메인별 명확한 이름 (useProducts, useLinks)

### 3. **한 번에 하나씩**
- Hook 하나 구현 → 페이지 적용 → 테스트 → 다음 Hook

---

## 다음 단계

Phase 8 완료 후:
- **Phase 9**: API 계층 생성 (mockData → API 함수)
- **Phase 10**: React Query 도입
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

