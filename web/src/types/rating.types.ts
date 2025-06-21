export interface Rating {
  id: string;
  score: number;
  comment?: string;
  createdAt: string;
  userId: string;
  movieId?: string;
}

export interface CreateRatingDto {
  movieId: string;
  score: number;
  comment?: string;
}

export interface UpdateRatingDto {
  score?: number;
  comment?: string | null;
}
