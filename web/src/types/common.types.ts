export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}
