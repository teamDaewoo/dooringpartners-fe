// 공통으로 사용되는 타입들
export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface FilterParams {
  category?: string;
  status?: string;
  searchQuery?: string;
}
