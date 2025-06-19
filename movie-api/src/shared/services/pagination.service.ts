import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginationParamsDto } from '../dto/pagination-params.dto';
import { BadRequestException } from '@nestjs/common';

const SQL_FIELD_REGEX = /^[a-zA-Z0-9_]+$/;

export class PaginationService {
  static async paginate<T extends ObjectLiteral>(
    repository: Repository<T>,
    paginationParams: PaginationParamsDto,
    queryBuilderCallback?: (qb: SelectQueryBuilder<T>) => void,
  ) {
    const { limit = 10, offset = 0, sort } = paginationParams;

    const queryBuilder = repository.createQueryBuilder('entity');

    // Apply custom query builder modifications if provided
    if (queryBuilderCallback) {
      queryBuilderCallback(queryBuilder);
    }

    // Apply sorting if specified, guard against SQL injection
    if (sort) {
      const [field, order = 'ASC'] = sort.split(',');
      if (!field || !SQL_FIELD_REGEX.test(field)) {
        throw new BadRequestException('Invalid sort field');
      }
      const sortOrder = order.toUpperCase();
      if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
        throw new BadRequestException('Invalid sort order');
      }
      queryBuilder.orderBy(`entity.${field}`, sortOrder as 'ASC' | 'DESC');
    }

    // Apply pagination
    queryBuilder.take(limit).skip(offset);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      limit: +limit,
      offset: +offset,
    };
  }

  static createPaginationResponse<T>(
    items: T[],
    total: number,
    limit: number,
    offset: number,
  ) {
    return {
      data: items,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }
}
