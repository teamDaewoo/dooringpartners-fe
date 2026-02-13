import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getDashboardKPIs } from "@/api/dashboard/getDashboardKPIs";
import { getChartData } from "@/api/dashboard/getChartData";
import type { ReportKPIs } from "@/types/dashboard";

/**
 * 대시보드 데이터 관리 Hook
 *
 * 기능:
 * - KPI 데이터 조회
 * - 차트 데이터 조회
 *
 * @returns 대시보드 데이터 및 로딩/에러 상태
 */
export function useDashboard() {
  // KPI 데이터 조회
  const {
    data: kpis,
    isLoading: isLoadingKPIs,
    error: kpisError,
  } = useQuery<ReportKPIs>({
    queryKey: queryKeys.dashboard.kpis(),
    queryFn: getDashboardKPIs,
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 차트 데이터 조회
  const {
    data: chartData = [],
    isLoading: isLoadingChart,
    error: chartError,
  } = useQuery({
    queryKey: queryKeys.dashboard.charts(),
    queryFn: getChartData,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return {
    // 데이터
    kpis,
    chartData,

    // 로딩/에러 상태
    isLoading: isLoadingKPIs || isLoadingChart,
    isLoadingKPIs,
    isLoadingChart,
    error: kpisError || chartError,
  };
}
