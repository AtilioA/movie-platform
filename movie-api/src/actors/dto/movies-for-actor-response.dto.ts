import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MoviesForActorResponseDto {
  @ApiProperty({ description: 'The unique identifier of the movie' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The title of the movie' })
  title: string;

  @ApiProperty({ description: 'The release year of the movie', required: false })
  releaseYear?: number;

  @ApiProperty({ description: 'The date when the movie was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the movie was last updated' })
  updatedAt: Date;
}
