import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    MoviesModule
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService, TypeOrmModule],
})
export class RatingsModule {}
