import { mockFetch } from "../client";
import { notices as mockNotices } from "@/data/mockData";
import type { Notice, NoticeCategory } from "@/types/notice";

export interface GetNoticesParams {
  category?: NoticeCategory | "전체" | "최신순";
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetNoticesResponse {
  notices: Notice[];
  total: number;
}

/**
 * 공지사항 목록 조회 API
 *
 * @param params - 필터링 및 페이지네이션 파라미터
 * @returns 공지사항 목록과 총 개수
 */
export async function getNotices(params: GetNoticesParams = {}): Promise<GetNoticesResponse> {
  const { category, search, page = 1, perPage = 7 } = params;

  // Mock 데이터 필터링
  let filtered = [...mockNotices];

  if (category && category !== "전체" && category !== "최신순") {
    filtered = filtered.filter((n) => n.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((n) => n.title.toLowerCase().includes(searchLower));
  }

  // 최신순 정렬
  if (category === "최신순") {
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = filtered.slice(start, end);

  return mockFetch({
    notices: paginated,
    total,
  });
}
