import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getSettlements } from "@/api/settlement/getSettlements";
import { getSettlementKPIs } from "@/api/settlement/getSettlementKPIs";
import type { SettlementStatus } from "@/types/settlement";

export interface UseSettlementOptions {
  initialStatus?: SettlementStatus | "전체";
  initialSearch?: string;
  initialPage?: number;
  perPage?: number;
}

/**
 * 정산 데이터 관리 Hook
 *
 * 기능:
 * - 정산 KPI 조회
 * - 정산 목록 조회
 * - 상태 필터링
 * - 검색 필터링
 * - 페이지네이션
 *
 * @param options - 초기 옵션
 * @returns 정산 데이터 및 필터 상태
 */
export function useSettlement(options: UseSettlementOptions = {}) {
  const {
    initialStatus = "전체",
    initialSearch = "",
    initialPage = 1,
    perPage = 10,
  } = options;

  // 클라이언트 상태
  const [status, setStatus] = useState<SettlementStatus | "전체">(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // KPI 조회
  const {
    data: kpis,
    isLoading: isLoadingKPIs,
    error: kpisError,
  } = useQuery({
    queryKey: queryKeys.settlement.kpis(),
    queryFn: getSettlementKPIs,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 정산 목록 조회
  const {
    data: settlementsData,
    isLoading: isLoadingSettlements,
    error: settlementsError,
  } = useQuery({
    queryKey: queryKeys.settlement.list({
      status,
      search: searchQuery,
      page: currentPage,
      perPage,
    }),
    queryFn: () =>
      getSettlements({
        status,
        search: searchQuery,
        page: currentPage,
        perPage,
      }),
    staleTime: 1000 * 60 * 5, // 5분
  });

  const settlements = settlementsData?.settlements || [];
  const total = settlementsData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // 필터 변경 핸들러
  const handleStatusChange = (newStatus: SettlementStatus | "전체") => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    // 데이터
    kpis,
    settlements,
    total,

    // 로딩/에러 상태
    isLoading: isLoadingKPIs || isLoadingSettlements,
    isLoadingKPIs,
    isLoadingSettlements,
    error: kpisError || settlementsError,

    // 필터 상태
    status,
    searchQuery,
    currentPage,
    totalPages,
    perPage,

    // 액션
    setStatus: handleStatusChange,
    setSearchQuery: handleSearchChange,
    setCurrentPage,
  };
}
