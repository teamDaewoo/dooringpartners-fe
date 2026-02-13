import { mockFetch } from "../client";
import { products as mockProducts } from "@/api/mocks";
import type { Product } from "@/types/product";

export interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
}

/**
 * 상품 목록 조회 API
 *
 * @param params - 필터링 및 페이지네이션 파라미터
 * @returns 상품 목록과 총 개수
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<GetProductsResponse> {
  const { category, search, page = 1, perPage = 20 } = params;

  // Mock 데이터 필터링
  let filtered = [...mockProducts];

  if (category && category !== "전체") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchLower));
  }

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = filtered.slice(start, end);

  return mockFetch({
    products: paginated,
    total,
  });
}
