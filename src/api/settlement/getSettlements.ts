import { mockFetch } from "../client";
import { settlementData as mockSettlementData } from "@/api/mocks";
import type { SettlementRow, SettlementStatus } from "@/types/settlement";

export interface GetSettlementsParams {
  status?: SettlementStatus | "전체";
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetSettlementsResponse {
  settlements: SettlementRow[];
  total: number;
}

/**
 * 정산 목록 조회 API
 *
 * @param params - 필터링 및 페이지네이션 파라미터
 * @returns 정산 목록과 총 개수
 */
export async function getSettlements(
  params: GetSettlementsParams = {}
): Promise<GetSettlementsResponse> {
  const { status, search, page = 1, perPage = 10 } = params;

  // Mock 데이터 필터링
  let filtered = [...mockSettlementData];

  if (status && status !== "전체") {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.period.toLowerCase().includes(searchLower) ||
        s.productName.toLowerCase().includes(searchLower)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = filtered.slice(start, end);

  return mockFetch({
    settlements: paginated,
    total,
  });
}
