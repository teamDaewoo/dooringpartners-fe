import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { getProducts } from "@/api/product/getProducts";
import { getCategories } from "@/api/product/getCategories";
import type { ProductCategory } from "@/types/product";

export interface UseProductsOptions {
  initialCategory?: ProductCategory | "전체";
  initialSearch?: string;
  initialPage?: number;
  perPage?: number;
}

/**
 * 상품 목록 관리 Hook
 *
 * 기능:
 * - 상품 목록 조회 (React Query 기반)
 * - 카테고리 필터링
 * - 검색 필터링
 * - 페이지네이션
 *
 * @param options - 초기 옵션
 * @returns 상품 목록 및 필터 상태
 */
export function useProducts(options: UseProductsOptions = {}) {
  const {
    initialCategory = "전체",
    initialSearch = "",
    initialPage = 1,
    perPage = 6,
  } = options;

  // 클라이언트 상태 (필터, 페이지네이션)
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "전체">(
    initialCategory
  );
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 카테고리 목록 조회
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30, // 30분 (카테고리는 자주 변하지 않음)
  });

  // 상품 목록 조회
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: queryKeys.products.list({
      category: selectedCategory,
      search: searchQuery,
      page: currentPage,
      perPage,
    }),
    queryFn: () =>
      getProducts({
        category: selectedCategory,
        search: searchQuery,
        page: currentPage,
        perPage,
      }),
    staleTime: 1000 * 60 * 5, // 5분
  });

  const products = productsData?.products || [];
  const total = productsData?.total || 0;

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // 검색어 변경 핸들러
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: ProductCategory | "전체") => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // 데이터
    products,
    categories,
    total,

    // 로딩/에러 상태
    isLoading: isLoadingProducts,
    error: productsError,

    // 필터 상태
    searchQuery,
    selectedCategory,
    currentPage,
    totalPages,
    perPage,

    // 액션
    setSearchQuery: handleSearchChange,
    setSelectedCategory: handleCategoryChange,
    setCurrentPage: handlePageChange,
  };
}
