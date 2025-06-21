import { Actor } from './actor.types';
import { Rating } from './rating.types';
import { BaseShape, Response } from './common.types';

export interface Movie extends BaseShape {
  id: string;
  title: string;
  averageRating?: number;
  actors?: Actor[];
}

export interface MovieDetails extends Movie {
  actors?: Actor[];
  ratings?: Rating[];
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
export type MoviesResponse = Response<Movie>;
