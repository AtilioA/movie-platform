import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Actor])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService, TypeOrmModule],
})
export class MoviesModule {}
