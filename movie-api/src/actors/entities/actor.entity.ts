import { Entity, Column, ManyToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { BaseEntity } from '@app/shared/entities/base.entity';
import { Movie } from '@app/movies/entities/movie.entity';

@Entity('actors')
export class Actor extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.actors, { cascade: false })
  movies: Movie[];
}
