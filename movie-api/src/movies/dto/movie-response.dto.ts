import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MovieActorDto {
  @ApiProperty({ description: 'The unique identifier of the actor' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the actor' })
  name: string;
}

export class MovieRatingDto {
  @ApiProperty({ description: 'The unique identifier of the rating' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The rating score' })
  score: number;

  @ApiProperty({ description: 'The ID of the user who created the rating' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The date when the rating was created' })
  createdAt: Date;
}

export class MovieResponseDto {
  @ApiProperty({ description: 'The unique identifier of the movie' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The title of the movie' })
  title: string;

  @ApiProperty({ 
    description: 'The actors in the movie',
    type: [MovieActorDto],
    required: false 
  })
  actors?: MovieActorDto[];

  @ApiProperty({ 
    description: 'The ratings for the movie',
    type: [MovieRatingDto],
    required: false 
  })
  ratings?: MovieRatingDto[];

  @ApiProperty({ description: 'The date when the movie was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the movie was last updated' })
  updatedAt: Date;
}
