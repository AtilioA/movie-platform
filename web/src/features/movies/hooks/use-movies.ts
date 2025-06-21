import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { searchMovies } from '@/services/movie-service';
import { QUERY_KEYS } from '@/lib/react-query';
import type { Movie } from '@/types/movie.types';
import type { PaginatedResponse } from '@/types/common.types';

type UseMoviesOptions = {
  query?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
};

export function useMovies({
  query = '',
  page = 1,
  limit = 10,
  enabled = true,
}: UseMoviesOptions = {}) {
  const options: UseQueryOptions<PaginatedResponse<Movie>, Error> = {
    queryKey: [QUERY_KEYS.MOVIES, { query, page, limit }],
    queryFn: () => searchMovies(query, page, limit),
    // Use placeholderData to keep previous data while fetching
    placeholderData: (previousData) => previousData,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  };

  return useQuery<PaginatedResponse<Movie>, Error>(options);
}
