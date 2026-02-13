import { mockFetch } from "../client";
import { receiptKPIs as mockReceiptKPIs } from "@/data/mockData";
import type { ReceiptKPIs } from "@/types/settlement";

/**
 * 정산 KPI 데이터 조회 API
 *
 * @returns 정산 KPI 데이터
 */
export async function getSettlementKPIs(): Promise<ReceiptKPIs> {
  return mockFetch(mockReceiptKPIs);
}
