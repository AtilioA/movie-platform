import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const QUERY_KEYS = {
  MOVIES: 'movies',
  MOVIE: 'movie',
  ACTORS: 'actors',
  ACTOR: 'actor',
} as const;
