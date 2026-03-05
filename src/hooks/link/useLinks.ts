import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getLinks } from "@/api/link/getLinks";
import type { LinkPlatform, LinkStatus, LinkPriority } from "@/types/link";

export interface UseLinksOptions {
  initialPlatform?: LinkPlatform | "전체";
  initialStatus?: LinkStatus | "전체";
  initialPriority?: LinkPriority | "전체";
  initialSearch?: string;
  initialPage?: number;
  perPage?: number;
}

/**
 * 링크 목록 관리 Hook
 *
 * 기능:
 * - 링크 목록 조회
 * - 플랫폼/상태/우선순위 필터링
 * - 검색 필터링
 * - 페이지네이션
 *
 * @param options - 초기 옵션
 * @returns 링크 목록 및 필터 상태
 */
export function useLinks(options: UseLinksOptions = {}) {
  const {
    initialPlatform = "전체",
    initialStatus = "전체",
    initialPriority = "전체",
    initialSearch = "",
    initialPage = 1,
    perPage = 10,
  } = options;

  // 클라이언트 상태
  const [platform, setPlatform] = useState<LinkPlatform | "전체">(initialPlatform);
  const [status, setStatus] = useState<LinkStatus | "전체">(initialStatus);
  const [priority, setPriority] = useState<LinkPriority | "전체">(initialPriority);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 링크 목록 조회
  const {
    data: linksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.links.list({
      platform,
      status,
      priority,
      search: searchQuery,
      page: currentPage,
      perPage,
    }),
    queryFn: () =>
      getLinks({
        platform,
        status,
        priority,
        search: searchQuery,
        page: currentPage,
        perPage,
      }),
    staleTime: 1000 * 60 * 5, // 5분
  });

  const links = linksData?.links || [];
  const total = linksData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // 필터 변경 핸들러 (페이지 리셋)
  const handlePlatformChange = (newPlatform: LinkPlatform | "전체") => {
    setPlatform(newPlatform);
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatus: LinkStatus | "전체") => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handlePriorityChange = (newPriority: LinkPriority | "전체") => {
    setPriority(newPriority);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    // 데이터
    links,
    total,

    // 로딩/에러 상태
    isLoading,
    error,

    // 필터 상태
    platform,
    status,
    priority,
    searchQuery,
    currentPage,
    totalPages,
    perPage,

    // 액션
    setPlatform: handlePlatformChange,
    setStatus: handleStatusChange,
    setPriority: handlePriorityChange,
    setSearchQuery: handleSearchChange,
    setCurrentPage,
  };
}
