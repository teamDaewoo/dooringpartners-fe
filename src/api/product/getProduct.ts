import { mockFetch } from "../client";
import { products as mockProducts } from "@/api/mocks";
import type { Product } from "@/types/product";

/**
 * 단일 상품 조회 API
 *
 * @param id - 상품 ID (문자열)
 * @returns 상품 정보 또는 null
 */
export async function getProduct(id: string): Promise<Product | null> {
  const product = mockProducts.find((p) => String(p.id) === id);
  return mockFetch(product || null);
}
