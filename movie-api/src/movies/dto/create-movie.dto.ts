import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  actorIds?: number[];
}
