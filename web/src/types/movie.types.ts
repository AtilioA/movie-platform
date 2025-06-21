import { Actor } from './actor.types';
import { Rating } from './rating.types';
import { Timestamps, PaginatedResponse } from './common.types';

export interface Movie extends Timestamps {
  id: string;
  title: string;
  averageRating?: number;
}

export interface MovieDetails extends Movie {
  actors: Pick<Actor, 'id' | 'name'>[];
  ratings: Rating[];
}

export interface CreateMovieDto {
  title: string;
  actorIds?: string[];
}

export interface UpdateMovieDto {
  title?: string;
  actorIds?: string[];
}

export type MovieResponse = MovieDetails;
export type MoviesResponse = PaginatedResponse<Movie>;
