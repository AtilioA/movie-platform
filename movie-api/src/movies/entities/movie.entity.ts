import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { BaseEntity } from '@app/shared/entities/base.entity';
import { Actor } from '@app/actors/entities/actor.entity';
import { Rating } from '@app/ratings/entities/rating.entity';

@Entity('movies')
export class Movie extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsString()
  title: string;

  @ManyToMany(() => Actor, (actor) => actor.movies, { cascade: false })
  @JoinTable({
    name: 'movie_actors',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'actorId', referencedColumnName: 'id' },
  })
  actors: Actor[];

  @OneToMany(() => Rating, (rating) => rating.movie, { cascade: ['remove'] })
  ratings: Rating[];
}
