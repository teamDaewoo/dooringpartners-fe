import { mockFetch } from "../client";
import { reportKPIs } from "@/api/mocks";
import type { ReportKPIs } from "@/types/dashboard";

/**
 * 대시보드 KPI 데이터 조회 API
 *
 * @returns KPI 객체
 */
export async function getDashboardKPIs(): Promise<ReportKPIs> {
  return mockFetch(reportKPIs);
}
