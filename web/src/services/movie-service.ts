import { apiClient } from './api-client';
import type { Movie, MovieDetails, CreateMovieDto, UpdateMovieDto } from '@/types/movie.types';
import type { Actor } from '@/types/actor.types';
import type { Rating } from '@/types/rating.types';
import { Response } from '@/types/common.types';

export interface SearchMoviesParams {
  query?: string;
  page?: number;
  limit?: number;
}

export async function searchMovies(
  query: string = '',
  page: number = 1,
  limit: number = 10
): Promise<Response<Movie>> {
  const offset = (page - 1) * limit;
  const params = new URLSearchParams();
  
  if (query.trim()) {
    params.append('q', query.trim());
  }
  
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  const response = await apiClient<Response<Movie>>(
    `/movies?${params.toString()}`
  );
  return response;
}

export interface NormalizedMovieDetails extends Omit<MovieDetails, 'ratings' | 'actors'> {
  ratings: Rating[];
  actors: Actor[];
}

export async function getMovieById(id: string): Promise<NormalizedMovieDetails> {
  const response = await apiClient<Response<MovieDetails>>(`/movies/${id}?include=ratings,actors`);

  if (!response?.success || !response.data) {
    throw new Error(`Movie with id ${id} not found`);
  }

  const movieData = response.data;

  // Ensure ratings and actors are always arrays, even if missing from the response
  return {
    ...movieData,
    ratings: movieData.ratings || [],
    actors: movieData.actors || []
  };
}

export async function getMovieActors(
  movieId: string,
  page = 1,
  limit = 100
): Promise<Response<Actor>> {
  const offset = (page - 1) * limit;
  return apiClient<Response<Actor>>(
    `/movies/${movieId}/actors?limit=${limit}&offset=${offset}`
  );
}

export async function getMovieRatings(
  movieId: string,
  page = 1,
  limit = 10
): Promise<Response<Rating>> {
  const offset = (page - 1) * limit;
  return apiClient<Response<Rating>>(
    `/ratings/movie/${movieId}?limit=${limit}&offset=${offset}`
  );
}

export async function createMovie(movieData: CreateMovieDto): Promise<Movie> {
  return apiClient<Movie>('/movies', {
    method: 'POST',
    body: JSON.stringify(movieData),
  });
}

export async function updateMovie(
  id: string,
  movieData: UpdateMovieDto
): Promise<Movie> {
  return apiClient<Movie>(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData),
  });
}

export async function deleteMovie(id: string): Promise<void> {
  return apiClient<void>(`/movies/${id}`, {
    method: 'DELETE',
  });
}
