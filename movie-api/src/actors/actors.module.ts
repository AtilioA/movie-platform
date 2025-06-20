import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';
import { Actor } from './entities/actor.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor, Movie])],
  controllers: [ActorsController],
  providers: [ActorsService],
  exports: [ActorsService, TypeOrmModule],
})
export class ActorsModule {}
