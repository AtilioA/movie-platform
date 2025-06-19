import { IsString, IsNotEmpty, IsArray, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  @Type(() => String)
  actorIds?: string[];
}
