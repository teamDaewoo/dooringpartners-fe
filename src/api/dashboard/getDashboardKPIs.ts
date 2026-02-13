import { mockFetch } from "../client";
import { dashboardKPIs as mockDashboardKPIs } from "@/data/mockData";
import type { DashboardKPIs } from "@/types/dashboard";

/**
 * 대시보드 KPI 데이터 조회 API
 *
 * @returns KPI 객체
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  return mockFetch(mockDashboardKPIs);
}
