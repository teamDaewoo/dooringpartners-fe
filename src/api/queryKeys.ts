/**
 * Query Key Factory
 *
 * React Query의 캐시 키를 계층적으로 관리하는 팩토리 패턴
 * 각 도메인별로 일관된 키 구조를 제공하여 캐시 무효화 및 관리를 용이하게 함
 *
 * 키 구조:
 * - all: 해당 도메인의 모든 쿼리 무효화 시 사용
 * - lists: 목록 조회 쿼리 (필터/페이지네이션 파라미터 포함)
 * - list: 특정 조건의 목록
 * - details: 단일 항목 조회 쿼리
 * - detail: 특정 ID의 항목
 */

export const queryKeys = {
  // 상품 관련
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters: { category?: string; search?: string; page?: number; perPage?: number }) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  // 카테고리 관련
  categories: {
    all: ["categories"] as const,
  },

  // 대시보드 관련
  dashboard: {
    all: ["dashboard"] as const,
    kpis: () => [...queryKeys.dashboard.all, "kpis"] as const,
    charts: () => [...queryKeys.dashboard.all, "charts"] as const,
  },

  // 링크 관련
  links: {
    all: ["links"] as const,
    lists: () => [...queryKeys.links.all, "list"] as const,
    list: (filters: {
      platform?: string;
      status?: string;
      priority?: string;
      search?: string;
      page?: number;
      perPage?: number;
    }) => [...queryKeys.links.lists(), filters] as const,
  },

  // 정산 관련
  settlement: {
    all: ["settlement"] as const,
    kpis: () => [...queryKeys.settlement.all, "kpis"] as const,
    lists: () => [...queryKeys.settlement.all, "list"] as const,
    list: (filters: { status?: string; search?: string; page?: number; perPage?: number }) =>
      [...queryKeys.settlement.lists(), filters] as const,
  },

  // 공지사항 관련
  notices: {
    all: ["notices"] as const,
    lists: () => [...queryKeys.notices.all, "list"] as const,
    list: (filters: { category?: string; search?: string; page?: number; perPage?: number }) =>
      [...queryKeys.notices.lists(), filters] as const,
  },

  // Q&A 관련
  qna: {
    all: ["qna"] as const,
    lists: () => [...queryKeys.qna.all, "list"] as const,
    list: (filters: { category?: string; search?: string }) =>
      [...queryKeys.qna.lists(), filters] as const,
  },

  // 가이드 관련
  guide: {
    all: ["guide"] as const,
    sections: () => [...queryKeys.guide.all, "sections"] as const,
  },
} as const;
