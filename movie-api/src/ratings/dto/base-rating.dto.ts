import { IsNumber, Min, Max, IsString, IsOptional, IsUUID } from 'class-validator';

export class BaseRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsUUID()
  movieId: string;
}
