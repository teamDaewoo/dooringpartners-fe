import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getProduct } from "@/api/product/getProduct";

/**
 * 단일 상품 조회 Hook
 *
 * @param id - 상품 ID
 * @returns 상품 정보 및 로딩/에러 상태
 */
export function useProduct(id: string) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });

  return {
    product,
    isLoading,
    error,
  };
}
