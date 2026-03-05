import { mockFetch } from "../client";
import { categories as mockCategories } from "@/api/mocks";
import type { ProductCategory } from "@/types/product";

/**
 * 카테고리 목록 조회 API
 *
 * @returns 카테고리 목록
 */
export async function getCategories(): Promise<ProductCategory[]> {
  return mockFetch(mockCategories);
}
