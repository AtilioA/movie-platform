export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
