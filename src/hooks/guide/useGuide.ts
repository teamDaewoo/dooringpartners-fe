import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getGuideSections } from "@/api/guide/getGuideSections";

/**
 * 가이드 섹션 관리 Hook
 *
 * 기능:
 * - 가이드 섹션 목록 조회
 *
 * @returns 가이드 섹션 목록 및 로딩/에러 상태
 */
export function useGuide() {
  const {
    data: sections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.guide.sections(),
    queryFn: getGuideSections,
    staleTime: 1000 * 60 * 30, // 30분 (가이드는 자주 변하지 않음)
  });

  return {
    // 데이터
    sections,

    // 로딩/에러 상태
    isLoading,
    error,
  };
}
