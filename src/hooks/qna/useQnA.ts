import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getQnAItems } from "@/api/qna/getQnAItems";
import type { QnACategory } from "@/types/qna";

export interface UseQnAOptions {
  initialCategory?: QnACategory | "전체";
  initialSearch?: string;
}

/**
 * Q&A 관리 Hook
 *
 * 기능:
 * - Q&A 목록 조회
 * - 카테고리 필터링
 * - 검색 필터링
 *
 * @param options - 초기 옵션
 * @returns Q&A 목록 및 필터 상태
 */
export function useQnA(options: UseQnAOptions = {}) {
  const { initialCategory = "전체", initialSearch = "" } = options;

  // 클라이언트 상태
  const [activeCategory, setActiveCategory] = useState<QnACategory | "전체">(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Q&A 목록 조회
  const {
    data: qnaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.qna.list({
      category: activeCategory,
      search: searchQuery,
    }),
    queryFn: () =>
      getQnAItems({
        category: activeCategory,
        search: searchQuery,
      }),
    staleTime: 1000 * 60 * 5, // 5분
  });

  const items = qnaData?.items || [];
  const total = qnaData?.total || 0;

  // 필터 변경 핸들러
  const handleCategoryChange = (category: QnACategory | "전체") => {
    setActiveCategory(category);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return {
    // 데이터
    items,
    total,

    // 로딩/에러 상태
    isLoading,
    error,

    // 필터 상태
    activeCategory,
    searchQuery,

    // 액션
    setActiveCategory: handleCategoryChange,
    setSearchQuery: handleSearchChange,
  };
}
