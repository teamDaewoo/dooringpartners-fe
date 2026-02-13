import { QueryClient } from "@tanstack/react-query";

/**
 * React Query 클라이언트 설정
 *
 * 전역 기본 옵션:
 * - staleTime: 5분 (데이터가 신선하다고 간주되는 시간)
 * - gcTime: 10분 (캐시 메모리에 보관되는 시간, 이전 cacheTime)
 * - refetchOnWindowFocus: false (윈도우 포커스 시 자동 재요청 비활성화)
 * - retry: 1 (실패 시 1회 재시도)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (v5에서 cacheTime → gcTime으로 변경)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
