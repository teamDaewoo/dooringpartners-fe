# Phase 5: 타입 및 데이터 구조화

**목표:** 타입 우선 설계 → 데이터 구조 순서로 리팩토링
**예상 시간:** 30-40분
**위험도:** 🔴 높음 (타입 시스템 전면 재설계)

---

## 작업 순서

1. `src/data/mockData.ts` 분석
2. 타입 정의 추출 → `src/types/` 생성
3. Mock 데이터를 타입 기반으로 재구성
4. 모든 import 경로 업데이트

---

## Step 5.1: 현재 mockData 분석

**파일:** `src/data/mockData.ts`

### 현재 export된 데이터와 타입

| 데이터 | 타입 | 사용처 |
|-------|------|-------|
| `categories` | `string[]` | ProductSearchPage |
| `products` | `Product[]` | ProductSearchPage, ProductDetailPage |
| `kpis` | `KPI` | Dashboard |
| `chartData` | `ChartData[]` | Dashboard |
| `receiptKPIs` | - | Receipt |
| `settlementData` | `SettlementData[]` | Receipt |
| `notices` | `Notice[]` | NoticePage |
| `qnaItems` | `QnAItem[]` | QnAPage |
| `guideSections` | `GuideSection[]` | GuidePage |
| `linksData` | `LinkData[]` | LinkManagePage |

---

## Step 5.2: 타입 파일 생성

### 1. Product 타입
**파일:** `src/types/product.ts`

```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  commissionRate: number;
  commissionAmount: number;
  campaignStart: string;
  campaignEnd: string;
}

export type ProductCategory =
  | "전체"
  | "전자제품"
  | "패션"
  | "뷰티"
  | "식품"
  | "기타";
```

### 2. Link 타입
**파일:** `src/types/link.ts`

```typescript
export type LinkPlatform =
  | "네이버 블로그"
  | "유튜브"
  | "인스타그램"
  | "틱톡"
  | "기타";

export type LinkPriority = "높음" | "보통" | "낮음";

export type LinkStatus = "활성" | "만료예정" | "만료";

export interface LinkData {
  id: number;
  issuedNumber: string;
  platform: LinkPlatform;
  title: string;
  url: string;
  expectedIncome: number;
  expiryDate: string;
  priority: LinkPriority;
  status: LinkStatus;
}
```

### 3. Notice 타입
**파일:** `src/types/notice.ts`

```typescript
export type NoticeCategory =
  | "중요"
  | "공지사항"
  | "프로모션 및 이벤트"
  | "기타";

export interface Notice {
  id: number;
  title: string;
  date: string;
  category: NoticeCategory;
}
```

### 4. Settlement(Receipt) 타입
**파일:** `src/types/settlement.ts`

```typescript
export type SettlementStatus = "완료" | "대기" | "미지급";

export interface SettlementData {
  id: number;
  period: string;
  productName: string;
  sales: number;
  commission: number;
  status: SettlementStatus;
  date: string;
}

export interface ReceiptKPIs {
  totalSettlement: number;
  pendingSettlement: number;
  completedSettlement: number;
  expectedNextMonth: number;
}
```

### 5. QnA 타입
**파일:** `src/types/qna.ts`

```typescript
export interface QnAItem {
  id: number;
  question: string;
  answer: string;
}
```

### 6. Guide 타입
**파일:** `src/types/guide.ts`

```typescript
export interface GuideItem {
  id: string;
  title: string;
  content: string;
}

export interface GuideSection {
  id: string;
  title: string;
  items: GuideItem[];
}
```

### 7. Dashboard 타입
**파일:** `src/types/dashboard.ts`

```typescript
export interface KPI {
  totalRevenue: number;
  monthlyRevenue: number;
  activeLinks: number;
  conversionRate: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  clicks: number;
}
```

### 8. Common 타입
**파일:** `src/types/common.ts`

```typescript
// 공통으로 사용되는 타입들
export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface FilterParams {
  category?: string;
  status?: string;
  searchQuery?: string;
}
```

---

## Step 5.3: mockData 리팩토링

**파일:** `src/data/mockData.ts`

### 리팩토링 방향
```typescript
// 타입 import
import type { Product, ProductCategory } from "@/types/product";
import type { LinkData } from "@/types/link";
import type { Notice } from "@/types/notice";
import type { SettlementData, ReceiptKPIs } from "@/types/settlement";
import type { QnAItem } from "@/types/qna";
import type { GuideSection } from "@/types/guide";
import type { KPI, ChartData } from "@/types/dashboard";

// 타입 export 제거 (types 폴더에서 import)
export type {
  Product,
  ProductCategory,
  LinkData,
  Notice,
  SettlementData,
  ReceiptKPIs,
  QnAItem,
  GuideSection,
  KPI,
  ChartData,
};

// 데이터 export (기존 데이터 유지)
export const categories: ProductCategory[] = ["전체", "전자제품", "패션", "뷰티", "식품", "기타"];

export const products: Product[] = [
  // 기존 데이터
];

// ... 나머지 데이터들
```

---

## Step 5.4: 페이지별 import 업데이트

### ProductSearchPage
```tsx
// ❌ 기존
import { categories, products, type Product } from "@/data/mockData";

// ✅ 변경
import { categories, products } from "@/data/mockData";
import type { Product } from "@/types/product";
```

### LinkManagePage
```tsx
// ❌ 기존
import { linksData, type LinkPlatform, type LinkPriority, type LinkStatus } from "@/data/mockData";

// ✅ 변경
import { linksData } from "@/data/mockData";
import type { LinkPlatform, LinkPriority, LinkStatus } from "@/types/link";
```

### NoticePage
```tsx
// ❌ 기존
import { notices, type Notice } from "@/data/mockData";

// ✅ 변경
import { notices } from "@/data/mockData";
import type { Notice } from "@/types/notice";
```

### ReceiptPage
```tsx
// ❌ 기존
import { receiptKPIs, settlementData, type SettlementStatus } from "@/data/mockData";

// ✅ 변경
import { receiptKPIs, settlementData } from "@/data/mockData";
import type { SettlementStatus } from "@/types/settlement";
```

### QnAPage
```tsx
// ❌ 기존
import { qnaItems } from "@/data/mockData";

// ✅ 변경
import { qnaItems } from "@/data/mockData";
import type { QnAItem } from "@/types/qna";  // 타입 필요 시
```

### GuidePage
```tsx
// ❌ 기존
import { guideSections } from "@/data/mockData";

// ✅ 변경
import { guideSections } from "@/data/mockData";
import type { GuideSection } from "@/types/guide";  // 타입 필요 시
```

### Dashboard
```tsx
// ❌ 기존
import { kpis, chartData } from "@/data/mockData";

// ✅ 변경
import { kpis, chartData } from "@/data/mockData";
import type { KPI, ChartData } from "@/types/dashboard";  // 타입 필요 시
```

---

## 체크포인트

### 파일 존재 확인
- [ ] `src/types/product.ts` 생성
- [ ] `src/types/link.ts` 생성
- [ ] `src/types/notice.ts` 생성
- [ ] `src/types/settlement.ts` 생성
- [ ] `src/types/qna.ts` 생성
- [ ] `src/types/guide.ts` 생성
- [ ] `src/types/dashboard.ts` 생성
- [ ] `src/types/common.ts` 생성

### mockData 확인
- [ ] 타입 정의 제거됨
- [ ] 타입 import 추가됨
- [ ] 데이터는 그대로 유지
- [ ] 타입 re-export 추가

### import 경로 확인
```bash
# 각 타입이 올바른 경로에서 import되는지 확인
grep -r "type.*Product" src/app --include="*.tsx"
grep -r "type.*Link" src/app --include="*.tsx"
grep -r "type.*Notice" src/app --include="*.tsx"
grep -r "type.*Settlement" src/app --include="*.tsx"
```

### 기능 확인
- [ ] 모든 페이지 정상 렌더링
- [ ] 데이터 표시 정상
- [ ] 필터링/검색 기능 정상

### 빌드 확인
- [ ] `npm run build` 성공
- [ ] TypeScript 오류 없음
- [ ] 타입 추론 정상

---

## 수정해야 할 파일 목록

### Types 생성 (8개)
- `src/types/product.ts`
- `src/types/link.ts`
- `src/types/notice.ts`
- `src/types/settlement.ts`
- `src/types/qna.ts`
- `src/types/guide.ts`
- `src/types/dashboard.ts`
- `src/types/common.ts`

### 데이터 파일
- `src/data/mockData.ts`

### 페이지 (import 변경)
- `src/app/(partners)/products/page.tsx`
- `src/app/(partners)/products/[id]/page.tsx`
- `src/app/(partners)/links/page.tsx`
- `src/app/(partners)/receipt/page.tsx`
- `src/app/(partners)/notice/page.tsx`
- `src/app/(partners)/qna/page.tsx`
- `src/app/(partners)/guide/page.tsx`
- `src/app/(partners)/dashboard/page.tsx`

---

## 문제 발생 시

**타입 오류:**
```bash
# TypeScript 서버 재시작 (VSCode)
Cmd + Shift + P → "TypeScript: Restart TS Server"

# 캐시 삭제
rm -rf .next
npm run build
```

**타입 찾을 수 없음:**
- types 폴더에서 export 확인
- import 경로 확인

**데이터 표시 안 됨:**
- mockData.ts에서 데이터 export 확인
- 타입만 변경하고 데이터는 유지 확인

---

## 커밋

```bash
git add .
git commit -m "refactor(structure): complete phase 5 - extract types and restructure mock data"
```

---

## 다음 단계

Phase 5 완료 후 → `docs/refactoring/phase6-cleanup.md` 진행
