import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MovieActorDto {
  @ApiProperty({ description: 'The unique identifier of the actor' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the actor' })
  name: string;

  constructor(partial: Partial<MovieActorDto>) {
    Object.assign(this, partial);
  }
}

export class MovieRatingDto {
  @ApiProperty({ description: 'The unique identifier of the rating' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The rating score' })
  score: number;

  @ApiProperty({ description: 'The date when the rating was created' })
  createdAt: Date;

  constructor(partial: Partial<MovieRatingDto>) {
    Object.assign(this, partial);
  }
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
    required: false,
  })
  actors?: MovieActorDto[];

  @ApiProperty({
    description: 'The ratings for the movie',
    type: [MovieRatingDto],
    required: false,
  })
  ratings?: MovieRatingDto[];

  @ApiProperty({ description: 'The date when the movie was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the movie was last updated' })
  updatedAt: Date;

  constructor(movie: Partial<MovieResponseDto>) {
    Object.assign(this, movie);

    if (movie && movie.actors) {
      this.actors = movie.actors.map(
        (actor: any) => new MovieActorDto(actor)
      );
    }

    if (movie && movie.ratings) {
      this.ratings = movie.ratings.map(
        (rating: any) => new MovieRatingDto(rating)
      );
    }
  }
}
