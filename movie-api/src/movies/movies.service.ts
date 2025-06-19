import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike, FindManyOptions } from 'typeorm';
import { BaseService } from '../shared/services/base.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';

@Injectable()
export class MoviesService extends BaseService<Movie> {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {
    super(movieRepository);
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);

    if (createMovieDto.actorIds && createMovieDto.actorIds.length > 0) {
      movie.actors = createMovieDto.actorIds.map(id => ({ id } as any));
    }

    return this.movieRepository.save(movie);
  }

  async findAllMovies(
    paginationParams: PaginationParamsDto,
    search?: string,
  ): Promise<PaginationResult<Movie>> {
    const { limit = 10, offset = 0, sort } = paginationParams;
    const page = Math.floor(offset / limit) + 1;

    const where: FindOptionsWhere<Movie> = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const options: FindManyOptions<Movie> = {
      where,
      relations: ['actors'],
      order: sort ? { [sort]: 'ASC' } : { title: 'ASC' },
    };

    return this.paginate(page, limit, options);
  }

  async findOneMovie(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'ratings'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOneMovie(id);

    if (updateMovieDto.title !== undefined) {
      movie.title = updateMovieDto.title;
    }

    if (updateMovieDto.actorIds) {
      movie.actors = updateMovieDto.actorIds.map(actorId => ({ id: actorId } as any));
    }

    return this.movieRepository.save(movie);
  }

  async removeMovie(id: string): Promise<void> {
    const result = await this.movieRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  }

  async searchMoviesByTitle(search: string): Promise<Movie[]> {
    return this.movieRepository.find({
      where: { title: ILike(`%${search}%`) },
      take: 10,
    });
  }
}
