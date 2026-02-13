# Phase 7: 타입 Import 분리 및 구조 개선

## 📋 개요

**목표**: 타입과 데이터의 결합 제거, 직접 import 구조로 전환
**예상 시간**: 20-30분
**위험도**: 🟢 낮음 (타입 경로만 변경)
**선행 작업**: Phase 1-6 완료
**후속 작업**: Phase 8 (Hook 분리)

---

## 🎯 목표

1. 모든 페이지에서 타입을 `@/types/*`에서 직접 import
2. 데이터는 `@/data/mockData`에서만 import
3. mockData.ts의 타입 re-export 제거
4. React Query 도입 준비를 위한 구조 개선

---

## 📊 현재 구조 분석

### 현재 문제점

**페이지에서의 import (products/page.tsx:12)**
```typescript
import { categories, products, type Product } from "@/data/mockData";
```

**mockData.ts의 구조**
```typescript
// 타입 import
import type { Product } from "@/types/product";

// 타입 re-export (backward compatibility)
export type { Product, ... };

// 데이터 export
export const products: Product[] = [...];
```

**문제점**:
- 타입과 데이터가 강하게 결합
- 타입만 필요해도 mockData 전체를 참조
- API 전환 시 모든 import 수정 필요

---

## 🎨 목표 구조

### Phase 7 완료 후

**페이지에서의 import**
```typescript
// ✅ 타입은 types에서
import type { Product, ProductCategory } from "@/types/product";
// ✅ 데이터는 data에서
import { products, categories } from "@/data/mockData";
```

**mockData.ts**
```typescript
// ✅ 타입 import만
import type { Product } from "@/types/product";

// ❌ 타입 re-export 제거
// export type { Product }; // 삭제

// ✅ 데이터만 export
export const products: Product[] = [...];
```

---

## 📝 작업 단계

### Step 1: 영향 범위 분석

모든 페이지 파일에서 mockData import 패턴 확인:

```bash
# 타입 import 패턴 찾기
grep -r "type.*from.*@/data/mockData" src/app --include="*.tsx"

# 결과: 9개 페이지에서 사용 중
# - dashboard/page.tsx
# - products/page.tsx
# - products/[id]/page.tsx
# - links/page.tsx
# - receipt/page.tsx
# - notice/page.tsx
# - qna/page.tsx
# - guide/page.tsx
```

### Step 2: 페이지별 타입 분석 및 매핑

| 페이지 | 현재 Import | 변경 후 Import |
|--------|------------|---------------|
| **dashboard** | `reportKPIs, reportChartData` (데이터만) | 변경 불필요 |
| **products** | `type Product, categories, products` | `@/types/product` + 데이터 |
| **products/[id]** | `type Product, products` | `@/types/product` + 데이터 |
| **links** | `type LinkRow, linksData` | `@/types/link` + 데이터 |
| **receipt** | `type SettlementRow, receiptKPIs, settlementData` | `@/types/settlement` + 데이터 |
| **notice** | `type Notice, notices` | `@/types/notice` + 데이터 |
| **qna** | `type QnAItem, qnaItems` | `@/types/qna` + 데이터 |
| **guide** | `type GuideSection, guideSections` | `@/types/guide` + 데이터 |

### Step 3: 파일별 수정 순서

각 페이지를 다음 순서로 수정:

1. 타입 import 추가: `import type { ... } from "@/types/*"`
2. mockData import에서 타입 제거
3. TypeScript 에러 확인
4. 빌드 테스트

#### 3.1 products/page.tsx

**변경 전:**
```typescript
import { categories, products, type Product } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { Product, ProductCategory } from "@/types/product";
import { categories, products } from "@/data/mockData";
```

#### 3.2 products/[id]/page.tsx

**변경 전:**
```typescript
import { products, type Product } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { Product } from "@/types/product";
import { products } from "@/data/mockData";
```

#### 3.3 links/page.tsx

**변경 전:**
```typescript
import { linksData, type LinkRow, type LinkStatus, type LinkPlatform } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { LinkRow, LinkStatus, LinkPlatform } from "@/types/link";
import { linksData } from "@/data/mockData";
```

#### 3.4 receipt/page.tsx

**변경 전:**
```typescript
import { settlementData, receiptKPIs, type SettlementRow } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { SettlementRow, ReceiptKPIs } from "@/types/settlement";
import { settlementData, receiptKPIs } from "@/data/mockData";
```

#### 3.5 notice/page.tsx

**변경 전:**
```typescript
import { notices, type Notice } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { Notice, NoticeCategory } from "@/types/notice";
import { notices } from "@/data/mockData";
```

#### 3.6 qna/page.tsx

**변경 전:**
```typescript
import { qnaItems, type QnAItem } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { QnAItem } from "@/types/qna";
import { qnaItems } from "@/data/mockData";
```

#### 3.7 guide/page.tsx

**변경 전:**
```typescript
import { guideSections, type GuideSection } from "@/data/mockData";
```

**변경 후:**
```typescript
import type { GuideSection } from "@/types/guide";
import { guideSections } from "@/data/mockData";
```

### Step 4: mockData.ts 정리

**변경 전:**
```typescript
// Re-export types for backward compatibility
export type {
  Product,
  ProductCategory,
  LinkRow,
  LinkPlatform,
  LinkPriority,
  LinkStatus,
  Notice,
  NoticeCategory,
  SettlementRow,
  SettlementStatus,
  ReceiptKPIs,
  QnAItem,
  GuideSection,
  DashboardKPIs,
  ReportKPIs,
  ChartDataPoint,
  RecentSale,
};
```

**변경 후:**
```typescript
// 타입 re-export 전체 삭제
// 데이터만 export
```

### Step 5: 검증

```bash
# TypeScript 에러 확인
npm run type-check

# 빌드 테스트
npm run build

# Dev 서버 실행
npm run dev
```

---

## 🧪 테스트 체크리스트

- [ ] 모든 페이지에서 타입 import 경로 확인
- [ ] TypeScript 컴파일 에러 없음
- [ ] 빌드 성공
- [ ] 각 페이지 정상 렌더링 확인:
  - [ ] `/dashboard`
  - [ ] `/products`
  - [ ] `/products/1`
  - [ ] `/links`
  - [ ] `/receipt`
  - [ ] `/notice`
  - [ ] `/qna`
  - [ ] `/guide`

---

## 🎁 이점

### 1. **명확한 의존성**
```typescript
// 이 파일이 어떤 타입을 사용하는지 명확
import type { Product } from "@/types/product";
import type { Link } from "@/types/link";
```

### 2. **API 전환 용이** (Phase 9+)
```typescript
// Phase 9: API 도입 시
import type { Product } from "@/types/product"; // ✅ 변경 불필요
// import { products } from "@/data/mockData"; // ❌ 삭제
import { useProducts } from "@/hooks/product/useProducts"; // ✅ 추가
```

### 3. **타입 재사용성**
```typescript
// 다른 곳에서도 동일한 타입 사용
import type { Product } from "@/types/product"; // ✅ 표준화
```

---

## 🔄 롤백 전략

Phase 7 완료 후 커밋:
```bash
git add .
git commit -m "refactor(structure): complete phase 7 - separate type imports from data"
```

문제 발생 시:
```bash
git revert HEAD
```

---

## 📌 주의사항

1. **타입만 import할 때 `type` 키워드 사용**
   ```typescript
   import type { Product } from "@/types/product"; // ✅
   import { Product } from "@/types/product"; // ❌ 런타임 import
   ```

2. **데이터와 타입을 한 줄에 섞지 않기**
   ```typescript
   // ❌ 나쁜 예
   import { products, type Product } from "@/data/mockData";

   // ✅ 좋은 예
   import type { Product } from "@/types/product";
   import { products } from "@/data/mockData";
   ```

3. **한 번에 하나씩 수정**
   - 페이지 하나 수정 → 테스트 → 다음 페이지
   - 모든 파일을 동시에 수정하지 말 것

---

## 다음 단계

Phase 7 완료 후:
- Phase 8: Hook 계층 분리 (비즈니스 로직 추출)
- Phase 9: API 계층 생성 (mockData → API 함수)
- Phase 10: React Query 도입
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

