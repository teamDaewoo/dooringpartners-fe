import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getNotices } from "@/api/notice/getNotices";
import type { NoticeCategory } from "@/types/notice";

export interface UseNoticesOptions {
  initialCategory?: NoticeCategory | "전체" | "최신순";
  initialSearch?: string;
  initialPage?: number;
  perPage?: number;
}

/**
 * 공지사항 관리 Hook
 *
 * 기능:
 * - 공지사항 목록 조회
 * - 카테고리 필터링
 * - 검색 필터링
 * - 페이지네이션
 *
 * @param options - 초기 옵션
 * @returns 공지사항 목록 및 필터 상태
 */
export function useNotices(options: UseNoticesOptions = {}) {
  const {
    initialCategory = "전체",
    initialSearch = "",
    initialPage = 1,
    perPage = 7,
  } = options;

  // 클라이언트 상태
  const [activeTab, setActiveTab] = useState<NoticeCategory | "전체" | "최신순">(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 공지사항 목록 조회
  const {
    data: noticesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.notices.list({
      category: activeTab,
      search: searchQuery,
      page: currentPage,
      perPage,
    }),
    queryFn: () =>
      getNotices({
        category: activeTab,
        search: searchQuery,
        page: currentPage,
        perPage,
      }),
    staleTime: 1000 * 60 * 5, // 5분
  });

  const notices = noticesData?.notices || [];
  const total = noticesData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // 필터 변경 핸들러
  const handleTabChange = (tab: NoticeCategory | "전체" | "최신순") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    // 데이터
    notices,
    total,

    // 로딩/에러 상태
    isLoading,
    error,

    // 필터 상태
    activeTab,
    searchQuery,
    currentPage,
    totalPages,
    perPage,

    // 액션
    setActiveTab: handleTabChange,
    setSearchQuery: handleSearchChange,
    setCurrentPage,
  };
}
