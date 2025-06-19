import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { IsString } from 'class-validator';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('actors')
export class Actor extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @Index({ fulltext: true })
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.actors, { cascade: false })
  movies: Movie[];
}
