import { mockFetch } from "../client";
import { linksData as mockLinksData } from "@/api/mocks";
import type { LinkRow, LinkPlatform, LinkStatus, LinkPriority } from "@/types/link";

export interface GetLinksParams {
  platform?: LinkPlatform | "전체";
  status?: LinkStatus | "전체";
  priority?: LinkPriority | "전체";
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetLinksResponse {
  links: LinkRow[];
  total: number;
}

/**
 * 링크 목록 조회 API
 *
 * @param params - 필터링 및 페이지네이션 파라미터
 * @returns 링크 목록과 총 개수
 */
export async function getLinks(params: GetLinksParams = {}): Promise<GetLinksResponse> {
  const { platform, status, priority, search, page = 1, perPage = 10 } = params;

  // Mock 데이터 필터링
  let filtered = [...mockLinksData];

  if (platform && platform !== "전체") {
    filtered = filtered.filter((link) => link.platform === platform);
  }

  if (status && status !== "전체") {
    filtered = filtered.filter((link) => link.status === status);
  }

  if (priority && priority !== "전체") {
    filtered = filtered.filter((link) => link.priority === priority);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((link) => link.title.toLowerCase().includes(searchLower));
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = filtered.slice(start, end);

  return mockFetch({
    links: paginated,
    total,
  });
}
