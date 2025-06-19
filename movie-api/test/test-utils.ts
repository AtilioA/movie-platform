/**
 * Creates pagination parameters for testing
 * @param params Object containing optional pagination parameters
 * @returns Pagination parameters object with helper methods
 */
export const createPaginationParams = (params: { 
  limit?: number; 
  offset?: number; 
  page?: number 
} = {}) => {
  const limit = params.limit || 10;
  const offset = params.offset || 0;
  const page = params.page || 1;
  
  return {
    limit,
    offset,
    page,
    getLimit: () => limit,
    getOffset: () => offset,
    sort: undefined,
    search: undefined,
  };
};

/**
 * Type for the pagination parameters returned by createPaginationParams
 */
export type PaginationParams = ReturnType<typeof createPaginationParams>;
