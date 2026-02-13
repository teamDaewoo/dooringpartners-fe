import { mockFetch } from "../client";
import { chartData as mockChartData } from "@/data/mockData";
import type { ChartDataPoint } from "@/types/dashboard";

/**
 * 대시보드 차트 데이터 조회 API
 *
 * @returns 차트 데이터 배열
 */
export async function getChartData(): Promise<ChartDataPoint[]> {
  return mockFetch(mockChartData);
}
