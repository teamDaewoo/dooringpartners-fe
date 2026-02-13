# 폴더 구조 리팩토링 작업 계획 (총괄)

## 의사결정 결과

### ✅ 확정된 방향
1. **Guide 페이지**: `(partners)/guide` - 로그인 후 전용
2. **TopBar**: 로그인 후에만 표시, marketing은 기본 구조만
3. **KPICard**: 2회 이상 사용 시 `common/`으로 이동
4. **Mock 데이터**: 타입 우선 설계 후 데이터 구조화
5. **AuthContext**: 분리 없이 현재 구조 유지 (추후 라이브러리 도입 예정)

---

## 작업 문서 구조

```
REFACTORING_PLAN.md          # 이 파일 - 총괄 계획
├── docs/refactoring/
│   ├── phase1-directories.md        # Phase 1: 디렉토리 생성
│   ├── phase2-pages.md              # Phase 2: 페이지 이동
│   ├── phase3-components.md         # Phase 3: 컴포넌트 이동
│   ├── phase4-auth.md               # Phase 4: Auth 구조
│   ├── phase5-types-data.md         # Phase 5: 타입 및 데이터
│   ├── phase6-cleanup.md            # Phase 6: 정리
│   ├── phase7-type-separation.md    # Phase 7: 타입 import 분리
│   ├── phase8-react-query-hooks.md  # Phase 8: React Query 기반 Hook 구현
│   └── progress.md                  # 진행 상황 및 이슈 트래킹
```

---

## Phase 별 요약

### Phase 1: 디렉토리 구조 생성
**목표:** 새 폴더만 생성, 기존 파일 유지
**파일:** `docs/refactoring/phase1-directories.md`
**예상 시간:** 5분
**위험도:** ⚪ 낮음 (생성만)

### Phase 2: 페이지 파일 이동 (app 재구성)
**목표:** (marketing), (partners) 그룹으로 페이지 분리
**파일:** `docs/refactoring/phase2-pages.md`
**예상 시간:** 20-30분
**위험도:** 🟡 중간 (라우팅 변경)

### Phase 3: 컴포넌트 파일 이동
**목표:** 도메인별 컴포넌트 분류
**파일:** `docs/refactoring/phase3-components.md`
**예상 시간:** 15-20분
**위험도:** 🟡 중간 (import 경로 대량 변경)

### Phase 4: Auth 구조 재구성
**목표:** auth 폴더로 통합
**파일:** `docs/refactoring/phase4-auth.md`
**예상 시간:** 10분
**위험도:** 🟢 낮음 (단순 이동)

### Phase 5: 타입 및 데이터 구조화
**목표:** 타입 정의 → 데이터 구조 순서로 리팩토링
**파일:** `docs/refactoring/phase5-types-data.md`
**예상 시간:** 30-40분
**위험도:** 🔴 높음 (타입 시스템 전면 재설계)

### Phase 6: 기존 파일 정리
**목표:** 이동 완료된 파일 삭제
**파일:** `docs/refactoring/phase6-cleanup.md`
**예상 시간:** 10분
**위험도:** 🟡 중간 (실수 삭제 위험)

### Phase 7: 타입 Import 분리
**목표:** 타입과 데이터의 결합 제거, 직접 import 구조 전환
**파일:** `docs/refactoring/phase7-type-separation.md`
**예상 시간:** 20-30분
**위험도:** 🟢 낮음 (타입 경로만 변경)

### Phase 8: React Query 기반 Hook 구현
**목표:** React Query + API 계층 + Hook 계층 통합 구현
**파일:** `docs/refactoring/phase8-react-query-hooks.md`
**예상 시간:** 180-200분 (3-3.5시간)
**위험도:** 🟡 중간 (라이브러리 도입 + 계층 분리)

---

## 최종 폴더 구조 (Phase 10 완료 후)

```
src/
├── app/
│   ├── layout.tsx                      # Root Layout (QueryClientProvider 포함)
│   ├── not-found.tsx
│   │
│   ├── (marketing)/                    # 로그인 전
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # / (랜딩)
│   │   ├── login/page.tsx              # /login
│   │   ├── signup/page.tsx             # /signup (폴더만)
│   │   └── _components/                # (폴더만)
│   │
│   └── (partners)/                     # 로그인 후
│       ├── layout.tsx                  # TopBar 포함
│       ├── dashboard/page.tsx          # /dashboard (UI만)
│       ├── products/
│       │   ├── page.tsx                # /products (UI만)
│       │   └── [id]/page.tsx           # /products/[id] (UI만)
│       ├── links/page.tsx              # (UI만)
│       ├── receipt/page.tsx            # (UI만)
│       ├── notice/page.tsx             # (UI만)
│       ├── qna/page.tsx                # (UI만)
│       └── guide/page.tsx              # (UI만)
│
├── api/                                # ⭐ Phase 9-10
│   ├── client.ts                       # API 클라이언트 설정
│   ├── queryKeys.ts                    # Query Key Factory
│   ├── product/
│   │   ├── getProducts.ts              # 상품 목록 조회
│   │   ├── getProduct.ts               # 단일 상품 조회
│   │   └── getCategories.ts            # 카테고리 조회
│   ├── dashboard/
│   │   ├── getDashboardKPIs.ts         # KPI 조회
│   │   └── getChartData.ts             # 차트 데이터 조회
│   ├── link/
│   │   └── getLinks.ts                 # 링크 목록 조회
│   ├── settlement/
│   │   ├── getSettlements.ts           # 정산 목록 조회
│   │   └── getSettlementKPIs.ts        # 정산 KPI 조회
│   ├── notice/
│   │   └── getNotices.ts               # 공지사항 조회
│   ├── qna/
│   │   └── getQnAItems.ts              # Q&A 조회
│   └── guide/
│       └── getGuideSections.ts         # 가이드 조회
│
├── hooks/                              # ⭐ Phase 8-10
│   ├── product/
│   │   ├── useProducts.ts              # React Query 사용
│   │   └── useProduct.ts               # React Query 사용
│   ├── dashboard/
│   │   └── useDashboard.ts             # React Query 사용
│   ├── link/
│   │   └── useLinks.ts                 # React Query 사용
│   ├── settlement/
│   │   └── useSettlement.ts            # React Query 사용
│   ├── notice/
│   │   └── useNotices.ts               # React Query 사용
│   ├── qna/
│   │   └── useQnA.ts                   # React Query 사용
│   ├── guide/
│   │   └── useGuide.ts                 # React Query 사용
│   ├── use-mobile.tsx                  # shadcn hook
│   └── use-toast.ts                    # shadcn hook
│
├── components/
│   ├── common/                         # 공용
│   │   ├── TopBar.tsx
│   │   ├── NavLink.tsx
│   │   └── KPICard.tsx                 # 2회 이상 사용
│   ├── auth/                           # (Phase 11+에서 채움)
│   ├── marketing/                      # (Phase 11+에서 채움)
│   ├── dashboard/                      # (Phase 11+에서 채움)
│   ├── campaign/                       # (Phase 11+에서 채움)
│   ├── link/                           # (Phase 11+에서 채움)
│   ├── notice/                         # (Phase 11+에서 채움)
│   └── ui/                             # shadcn components
│
├── auth/                               # Phase 4
│   ├── AuthContext.tsx
│   └── types.ts
│
├── types/                              # Phase 5-7
│   ├── product.ts
│   ├── link.ts
│   ├── notice.ts
│   ├── settlement.ts
│   ├── qna.ts
│   ├── guide.ts
│   ├── dashboard.ts
│   └── common.ts
│
├── data/                               # Phase 5-9
│   └── mockData.ts                     # API 함수에서만 사용
│
└── lib/
    ├── utils.ts
    ├── queryClient.ts                  # ⭐ Phase 10 (React Query 설정)
    └── constants.ts                    # (필요시)
```

---

## 진행 상황 추적

**현재 Phase:** Phase 7 완료 (타입 분리 완료)
**진행률:** 7/8 (87.5%)

**완료된 Phase:**
- ✅ Phase 1: 디렉토리 구조 생성
- ✅ Phase 2: 페이지 파일 이동
- ✅ Phase 3: 컴포넌트 파일 이동
- ✅ Phase 4: Auth 구조 재구성
- ✅ Phase 5: 타입 및 데이터 구조화
- ✅ Phase 6: 기존 파일 정리
- ✅ Phase 7: 타입 Import 분리

**다음 Phase:**
- ⏳ Phase 8: React Query 기반 Hook 구현 (API + Hook + React Query 통합)

실시간 진행 상황은 `docs/refactoring/progress.md` 참고

---

## 작업 시작 전 체크리스트

- [ ] Git 최신 커밋 확인 (`git status`)
- [ ] 현재 브랜치 확인
- [ ] Dev server 정상 실행 확인
- [ ] 백업 커밋 생성
  ```bash
  git add .
  git commit -m "chore: backup before refactoring"
  ```

---

## 롤백 전략

각 Phase 완료 시 커밋 생성:
```bash
git add .
git commit -m "refactor(structure): complete phase N - [작업명]"
```

문제 발생 시:
```bash
git log --oneline  # 커밋 이력 확인
git reset --hard [커밋 해시]  # 특정 Phase로 롤백
```

---

## ⚠️ Phase 완료 후 필수 작업

**각 Phase 작업 완료 후 반드시 `docs/refactoring/progress.md`를 업데이트하세요!**

### 업데이트 항목:
1. **Phase 진행 상황 테이블**: 상태를 ✅ 완료로, 완료 날짜 기입
2. **체크포인트**: 해당 Phase 체크포인트 항목 체크
3. **Git 커밋 이력**: 커밋 해시와 날짜 기록
4. **다음 작업**: 완료된 작업 체크, 현재 Phase 갱신

### 빠른 업데이트:
```bash
# progress.md 열기
code docs/refactoring/progress.md

# 또는
vi docs/refactoring/progress.md
```

각 Phase 문서 하단에도 동일한 안내가 포함되어 있습니다.

---

## Phase 7-8 아키텍처 개요

### 계층 분리 전략 (3-Layer Architecture)

```
┌─────────────────────────────────────────────────┐
│  Page Layer (app/)                              │
│  - UI 렌더링만 담당                              │
│  - Hook에서 데이터/로직 가져오기                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Hook Layer (hooks/)                            │
│  - 비즈니스 로직 (필터링, 페이지네이션)           │
│  - React Query를 통한 서버 상태 관리              │
│  - 클라이언트 상태 관리 (검색어, 필터 등)         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  API Layer (api/)                               │
│  - mockData 래핑 (Promise 기반)                  │
│  - 향후: 실제 HTTP 요청으로 전환                  │
└─────────────────────────────────────────────────┘
```

### Phase별 작업 흐름

**Phase 7: 타입 분리**
```typescript
// Before: mockData에서 타입도 가져옴
import { products, type Product } from "@/data/mockData";

// After: 타입과 데이터 분리
import type { Product } from "@/types/product";
import { products } from "@/data/mockData";
```

**Phase 8: React Query 기반 Hook 구현**
```typescript
// API 계층 생성
export async function getProducts() {
  return mockFetch(mockProducts);
}

// Hook에서 useQuery 사용
export function useProducts() {
  const { data: products = [] } = useQuery({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
  });

  // 비즈니스 로직 (필터링, 페이지네이션)
  const filtered = useMemo(() =>
    products.filter(...), [products, filters]
  );

  return { products: filtered, isLoading };
}

// 페이지에서 사용
function ProductsPage() {
  const { products, isLoading } = useProducts();
  return <div>{/* UI만 */}</div>;
}
```

### React Query 도입 이점

1. **자동 캐싱**: 같은 데이터를 여러 번 요청해도 캐시 활용
2. **로딩/에러 상태 자동 관리**: 별도 상태 관리 불필요
3. **자동 재요청**: Stale 데이터 자동 업데이트
4. **DevTools**: 캐시 상태 시각화
5. **성능 최적화**: 중복 요청 제거, Background refetch

### 추후 확장 계획 (Phase 9+)

1. **Phase 9**: UI 컴포넌트 분리
   - 페이지에서 UI 컴포넌트 추출
   - components/dashboard/, components/notice/ 구현

2. **Phase 10**: 실제 API 연동
   - API 함수를 실제 HTTP 요청으로 전환
   - 인증 토큰 처리
   - 에러 핸들링 강화

3. **Phase 11**: 성능 최적화
   - React.memo, useMemo, useCallback
   - Code splitting
   - Image optimization

---

## 참고 문서
- 각 Phase별 상세 계획: `docs/refactoring/phase*.md`
- 진행 상황: `docs/refactoring/progress.md`
- 폴더 구조 원칙: README.md (프로젝트 규칙)
