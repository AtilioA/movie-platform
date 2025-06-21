import { apiClient } from './api-client';
import type { MovieDetails } from '@/types/movie.types';
import type { PaginatedResponse } from '@/types/common.types';
import type { Actor } from '@/types/actor.types';
import type { Rating } from '@/types/rating.types';

export async function getMovieById(id: string): Promise<MovieDetails> {
  return apiClient<MovieDetails>(`movies/${id}`);
}

export async function getMovieActors(
  movieId: string,
  page = 1,
  limit = 100
): Promise<PaginatedResponse<Actor>> {
  const offset = (page - 1) * limit;
  return apiClient<PaginatedResponse<Actor>>(
    `movies/${movieId}/actors?limit=${limit}&offset=${offset}`
  );
}

export async function getMovieRatings(
  movieId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Rating>> {
  const offset = (page - 1) * limit;
  return apiClient<PaginatedResponse<Rating>>(
    `ratings/movie/${movieId}?limit=${limit}&offset=${offset}`
  );
}

export async function searchMovies(query: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return apiClient<PaginatedResponse<MovieDetails>>(
    `movies/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
  );
}
