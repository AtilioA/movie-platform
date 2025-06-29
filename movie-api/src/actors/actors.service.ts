import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Actor } from './entities/actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';
import { PaginationResponseDto } from '../shared/dto/pagination-response.dto';
import { ActorResponseDto } from './dto/actor-response.dto';
import { MovieResponseDto } from '../movies/dto/movie-response.dto';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorsRepository: Repository<Actor>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createActorDto: CreateActorDto): Promise<ActorResponseDto> {
    const actor = this.actorsRepository.create(createActorDto);
    const savedActor = await this.actorsRepository.save(actor);
    return new ActorResponseDto(savedActor);
  }

  async findAll(
    paginationParams: PaginationParamsDto,
    search?: string,
  ): Promise<PaginationResult<ActorResponseDto>> {
    const limit = paginationParams.getLimit();
    const offset = paginationParams.getOffset();

    const [items, total] = await this.actorsRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
    });

    return {
      items: items.map(actor => new ActorResponseDto(actor)),
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ActorResponseDto> {
    const actor = await this.actorsRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }

    return new ActorResponseDto(actor);
  }

  async getMoviesForActor(
    actorId: string,
    paginationParams: PaginationParamsDto
  ): Promise<PaginationResponseDto<MovieResponseDto>> {
    // First verify the actor exists (to return 404 if needed)
    // Could be optimized, but this is simpler
    const exists = await this.actorsRepository.count({ where: { id: actorId } });
    if (!exists) {
      throw new NotFoundException(`Actor with ID ${actorId} not found`);
    }

    const limit = paginationParams.getLimit();
    const offset = paginationParams.getOffset();

    const [movies, total] = await this.moviesRepository
      .createQueryBuilder('movie')
      .innerJoin('movie.actors', 'actor', 'actor.id = :actorId', { actorId })
      .orderBy('movie.title', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const movieDtos = movies.map((m) => new MovieResponseDto(m));

    return new PaginationResponseDto<MovieResponseDto>(movieDtos, {
      total,
      limit,
      offset,
    });
  }


  async update(id: string, updateActorDto: UpdateActorDto): Promise<ActorResponseDto> {
    const actor = await this.actorsRepository.preload({
      id,
      ...updateActorDto,
    });

    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }

    const updatedActor = await this.actorsRepository.save(actor);
    return new ActorResponseDto(updatedActor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.actorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
  }

  async searchActorsByName(
    name: string,
    paginationParams: PaginationParamsDto,
  ): Promise<PaginationResult<ActorResponseDto>> {
    const limit = paginationParams.getLimit();
    const offset = paginationParams.getOffset();

    const [items, total] = await this.actorsRepository.findAndCount({
      where: { name: ILike(`%${name}%`) },
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
    });

    return {
      items: items.map(actor => new ActorResponseDto(actor)),
      total,
      page: paginationParams.page || Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
    };
  }
}
