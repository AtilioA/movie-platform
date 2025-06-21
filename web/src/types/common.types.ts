export type ResponseMetadata = {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: ResponseMetadata;
}

export interface PaginatedResponse<T> {
  data: PaginatedData<T>;
  success: boolean;
  timestamp: string;
}

export interface Response<T> {
  data: T;
  success: boolean;
  timestamp: string;
}

export interface BaseShape {
  createdAt: string;
  updatedAt: string;
}
