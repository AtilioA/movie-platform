import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { NotFoundException } from '@nestjs/common';
import { PaginationResult } from '../interfaces/pagination-result.interface';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async paginate(page = 1, limit = 10, options?: FindManyOptions<T>): Promise<PaginationResult<T>> {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      take: limit,
      skip: (page - 1) * limit,
    });

    // Create a new result object with the correct type
    const result: PaginationResult<T> = {
      items: items as unknown as T[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    return result;
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async createWithDto(createDto: any): Promise<T> {
    return this.create(createDto);
  }

  async update<DTO = any>(id: string, updateDto: DTO): Promise<T> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return this.repository.save(entity);
  }

  async updateWithDto(id: string, updateDto: any): Promise<T> {
    return this.update(id, updateDto);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
  }
}
