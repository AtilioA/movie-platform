import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNumber, Min, Max, IsString, IsOptional, IsUUID } from 'class-validator';
import { BaseEntity } from '../../shared/entities/base.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity('ratings')
export class Rating extends BaseEntity {
  @Column({ type: 'integer' })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;

  @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column({ type: 'uuid' })
  @IsUUID()
  movieId: string;
}
