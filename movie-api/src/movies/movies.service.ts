import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, FindManyOptions } from 'typeorm';
import { BaseService } from '../shared/services/base.service';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';
import { PaginationResponseDto } from '../shared/dto/pagination-response.dto';
import { ActorResponseDto } from '../actors/dto/actor-response.dto';

@Injectable()
export class MoviesService extends BaseService<Movie> {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Actor)
    private readonly actorsRepository: Repository<Actor>,
  ) {
    super(movieRepository);
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { actorIds } = createMovieDto;
    const movie = this.movieRepository.create(createMovieDto);

    // Set up actor relationships if actorIds are provided
    if (actorIds?.length) {
      movie.actors = actorIds.map(actorId => ({ id: String(actorId) } as Actor));
    }

    return this.movieRepository.save(movie);
  }

  async findAllMovies(
    paginationParams: PaginationParamsDto,
    search?: string,
  ): Promise<PaginationResult<Movie>> {
    const { sort } = paginationParams;
    const limit = paginationParams.getLimit();
    const offset = paginationParams.getOffset();
    const page = paginationParams.page || Math.floor(offset / limit) + 1;

    const where: FindOptionsWhere<Movie> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const options: FindManyOptions<Movie> = {
      where,
      relations: ['actors'],
      order: sort ? { [sort]: 'ASC' } : { title: 'ASC' },
    };

    const result = await this.paginate(page, limit, options);
    return {
      items: result.items,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    };
  }

  async findOneMovie(id: string): Promise<Movie> {
    // Validate ID is not empty or invalid format
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'ratings'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async getActorsForMovie(
    movieId: string,
    paginationParams: PaginationParamsDto
  ): Promise<PaginationResponseDto<ActorResponseDto>> {
    // First verify the movie exists (404 if not)
    const exists = await this.movieRepository.count({ where: { id: movieId } });
    if (!exists) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const limit = paginationParams.getLimit();
    const offset = paginationParams.getOffset();

    const [actors, total] = await this.actorsRepository
      .createQueryBuilder('actor')
      .innerJoin('actor.movies', 'movie', 'movie.id = :movieId', { movieId })
      .orderBy('actor.name', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const actorDtos = actors.map((a: Actor) => new ActorResponseDto(a));

    return new PaginationResponseDto<ActorResponseDto>(actorDtos, {
      total,
      limit,
      offset,
    });
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOneMovie(id);

    if (updateMovieDto.title !== undefined) {
      movie.title = updateMovieDto.title;
    }

    if (updateMovieDto.actorIds) {
      movie.actors = updateMovieDto.actorIds.map(actorId => ({ id: String(actorId) } as Actor));
    }

    return this.movieRepository.save(movie);
  }

  async removeMovie(id: string): Promise<void> {
    // Validate ID is not empty or invalid format
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    const result = await this.movieRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }

  async searchMoviesByTitle(
    search: string,
    paginationParams?: PaginationParamsDto,
  ): Promise<PaginationResult<Movie>> {
    const limit = paginationParams?.limit || 10;
    const offset = paginationParams?.offset || 0;
    const page = Math.floor(offset / limit) + 1;

    // Validate search term
    if (!search || typeof search !== 'string' || search.trim().length === 0) {
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }

    const sanitizedSearch = search.trim();

    const where: FindOptionsWhere<Movie> = {
      title: ILike(`%${sanitizedSearch}%`),
    };

    const options: FindManyOptions<Movie> = {
      where,
      relations: ['actors'],
      order: { title: 'ASC' },
    };

    const result = await this.paginate(page, limit, options);
    return {
      items: result.items,
      total: result.total,
      page,
      totalPages: result.totalPages,
    };
  }
}
