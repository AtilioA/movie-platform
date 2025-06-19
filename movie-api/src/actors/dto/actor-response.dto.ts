import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Movie } from '../../movies/entities/movie.entity';

@Exclude()
export class ActorResponseDto {
  @ApiProperty({ description: 'Unique identifier of the actor' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the actor' })
  @Expose()
  name: string;

  @ApiProperty({ 
    description: 'List of movies the actor has appeared in',
    type: [Movie],
    required: false
  })
  @Expose()
  @Type(() => Movie)
  movies?: Movie[];

  @ApiProperty({ description: 'Date when the actor was created' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Date when the actor was last updated' })
  @Expose()
  updatedAt: Date;

  constructor(actor: Partial<Movie>) {
    Object.assign(this, actor);
    
    if (actor && 'movies' in actor) {
      this.movies = (actor as any).movies;
    }
  }
}
