import { mockFetch } from "../client";
import { qnaItems as mockQnAData } from "@/data/mockData";
import type { QnAItem, QnACategory } from "@/types/qna";

export interface GetQnAItemsParams {
  category?: QnACategory | "전체";
  search?: string;
}

export interface GetQnAItemsResponse {
  items: QnAItem[];
  total: number;
}

/**
 * Q&A 목록 조회 API
 *
 * @param params - 필터링 파라미터
 * @returns Q&A 목록과 총 개수
 */
export async function getQnAItems(params: GetQnAItemsParams = {}): Promise<GetQnAItemsResponse> {
  const { category, search } = params;

  // Mock 데이터 필터링
  let filtered = [...mockQnAData];

  if (category && category !== "전체") {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower)
    );
  }

  return mockFetch({
    items: filtered,
    total: filtered.length,
  });
}
