# Phase 9: UI 컴포넌트 분리

## 목표

Page 컴포넌트에서 UI를 완전히 분리하여 재사용 가능한 컴포넌트로 추출

## 작업 원칙

1. **도메인별 분리 우선**: 각 도메인(product, dashboard, link 등)의 components/ 폴더에 UI 컴포넌트 배치
2. **공통 컴포넌트는 나중에**: 모든 도메인 작업 완료 후 중복된 컴포넌트를 common/으로 이동
3. **Page는 조립만**: Page 컴포넌트는 Hook + UI 컴포넌트 조립만 담당

## 작업 순서

### Phase 9-1: 각 도메인별 UI 분리 (개별 작업)

각 페이지를 읽고 UI를 컴포넌트로 분리. 한 도메인씩 완료 후 progress.md에 기록.

**작업 순서:**

1. **products** (2개 페이지)
   - `src/app/(partners)/products/page.tsx`
   - `src/app/(partners)/products/[id]/page.tsx`

2. **dashboard** (1개 페이지)
   - `src/app/(partners)/dashboard/page.tsx`

3. **links** (1개 페이지)
   - `src/app/(partners)/links/page.tsx`

4. **receipt** (1개 페이지)
   - `src/app/(partners)/receipt/page.tsx`

5. **notice** (1개 페이지)
   - `src/app/(partners)/notice/page.tsx`

6. **qna** (1개 페이지)
   - `src/app/(partners)/qna/page.tsx`

7. **guide** (1개 페이지)
   - `src/app/(partners)/guide/page.tsx`

### Phase 9-2: 공통 컴포넌트 추출 (최종 작업)

모든 도메인 작업 완료 후, 중복된 컴포넌트를 찾아서 `components/common/`으로 이동.

**찾아볼 패턴:**
- Table 컴포넌트 (links, receipt, notice에서 사용)
- Card 레이아웃 패턴
- Filter UI 패턴
- Pagination 컴포넌트

## 컴포넌트 분리 가이드

### 1. 각 도메인별 components 폴더 생성

```
src/components/
├── product/           # products 페이지 UI
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetailInfo.tsx
│   ├── ProductFilters.tsx
│   └── CategorySidebar.tsx
│
├── dashboard/         # dashboard 페이지 UI
│   ├── DashboardHeader.tsx
│   ├── DashboardKPIs.tsx
│   ├── DashboardChart.tsx
│   └── DateChips.tsx
│
├── link/              # links 페이지 UI
│   ├── LinkTable.tsx
│   ├── LinkTableRow.tsx
│   ├── LinkFilters.tsx
│   └── LinkHeader.tsx
│
├── settlement/        # receipt 페이지 UI
│   ├── SettlementKPIs.tsx
│   ├── SettlementTable.tsx
│   ├── SettlementTableRow.tsx
│   ├── MonthSelector.tsx
│   └── SettlementActions.tsx
│
├── notice/            # notice 페이지 UI
│   ├── NoticeTable.tsx
│   ├── NoticeTableRow.tsx
│   ├── NoticeFilters.tsx
│   └── NoticeHeader.tsx
│
├── qna/               # qna 페이지 UI
│   ├── QnAAccordion.tsx
│   ├── QnAAccordionItem.tsx
│   ├── QnAHeader.tsx
│   └── QnATabs.tsx
│
├── guide/             # guide 페이지 UI
│   ├── GuideSidebar.tsx
│   ├── GuideSidebarItem.tsx
│   ├── GuideContent.tsx
│   └── GuideNavigation.tsx
│
└── common/            # 공통 컴포넌트 (Phase 9-2에서 추가)
    ├── KPICard.tsx    # 이미 존재
    ├── TopBar.tsx     # 이미 존재
    └── NavLink.tsx    # 이미 존재
```

### 2. 컴포넌트 분리 원칙

**Page 컴포넌트 (Before):**
```tsx
export default function ProductsPage() {
  const { products, categories, ... } = useProducts();

  return (
    <div>
      {/* 검색 UI */}
      {/* 필터 UI */}
      {/* 상품 그리드 UI */}
      {/* 페이지네이션 UI */}
    </div>
  );
}
```

**Page 컴포넌트 (After):**
```tsx
export default function ProductsPage() {
  const hookData = useProducts();

  return (
    <div>
      <ProductHeader />
      <ProductFilters hookData={hookData} />
      <ProductGrid products={hookData.products} />
      <ProductPagination hookData={hookData} />
    </div>
  );
}
```

### 3. Props 패턴

**Option 1: Hook 데이터 전체 전달 (권장)**
```tsx
interface ProductFiltersProps {
  hookData: ReturnType<typeof useProducts>;
}
```

**Option 2: 개별 Props 전달**
```tsx
interface ProductFiltersProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

### 4. 컴포넌트 크기 기준

- **Small (10-30 lines)**: 단일 UI 요소 (Card, Button, Badge)
- **Medium (30-80 lines)**: UI 섹션 (Filters, Table, Grid)
- **Large (80+ lines)**: 복잡한 UI 섹션은 더 작은 컴포넌트로 분리

### 5. 파일명 규칙

- PascalCase 사용
- 역할을 명확하게: `ProductCard`, `ProductGrid`, `ProductFilters`
- 도메인 접두사: `Product`, `Link`, `Settlement` 등

## 작업 체크리스트 (각 도메인별)

- [ ] 도메인 폴더 생성 (`src/components/{domain}/`)
- [ ] UI 컴포넌트 추출 (3-5개 예상)
- [ ] Page 컴포넌트를 조립 코드로 단순화
- [ ] Import 경로 수정
- [ ] 빌드 성공 확인
- [ ] progress.md에 완료 기록
- [ ] Git 커밋

## Progress 기록 형식

```markdown
### Phase 9-1: UI 분리 진행

- ✅ products: ProductCard, ProductGrid, ProductFilters, CategorySidebar, ProductDetailInfo (5개)
- ✅ dashboard: DashboardKPIs, DashboardChart, DateChips (3개)
- ⏸️ links: 대기
- ⏸️ receipt: 대기
- ⏸️ notice: 대기
- ⏸️ qna: 대기
- ⏸️ guide: 대기
```

## 예상 소요 시간

- 각 도메인: 15-25분
- 전체 7개 도메인: 약 2-3시간
- 공통 컴포넌트 추출: 30분
- **총 예상 시간: 2.5-3.5시간**

## 롤백 전략

각 도메인 완료 시마다 커밋:
```bash
git commit -m "feat(phase9): extract UI components for {domain}"
```

## 다음 단계

Phase 9 완료 후:
- Phase 10: 실제 API 연동 (선택)
- Phase 11: 성능 최적화 (선택)

---

**⚠️ 중요:**
- 각 도메인 작업 시 페이지를 읽고 실제 UI 구조를 파악
- 토큰 절약을 위해 한 도메인씩 완료 후 커밋
- progress.md에 간단히 기록 (컴포넌트 개수만)
- 공통 컴포넌트 추출은 모든 도메인 완료 후 진행
