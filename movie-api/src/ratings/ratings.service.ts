import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingQueryDto } from './dto/rating-query.dto';
import { MoviesService } from '../movies/movies.service';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly moviesService: MoviesService,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    // Verify if movie exists
    try {
      await this.moviesService.findOne(createRatingDto.movieId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Movie not found');
      }
      throw error;
    }

    const rating = this.ratingRepository.create({
      ...createRatingDto,
    });

    return this.ratingRepository.save(rating);
  }

  async findAll(query: RatingQueryDto): Promise<PaginationResult<Rating>> {
    const { movieId, page = 1, limit = 10 } = query;
    const where: FindOptionsWhere<Rating> = {};

    if (movieId) {
      where.movieId = movieId;
    }

    const [items, total] = await this.ratingRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      relations: ['movie'],
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { id } as FindOptionsWhere<Rating>,
      relations: ['movie'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingRepository.preload({
      id,
      ...updateRatingDto,
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return this.ratingRepository.save(rating);
  }

  async remove(id: string): Promise<void> {
    const rating = await this.ratingRepository.findOne({
      where: { id } as FindOptionsWhere<Rating>,
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    await this.ratingRepository.remove(rating);
  }
}
