import { IsOptional, IsNumber, Min, IsUUID, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RatingQueryDto {
  @IsOptional()
  @IsUUID()
  movieId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}
