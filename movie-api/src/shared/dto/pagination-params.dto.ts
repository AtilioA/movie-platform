import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export const DEFAULT_PAGE_LIMIT = 10;

export class PaginationParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = DEFAULT_PAGE_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  sort?: string;

  getOffset(): number {
    if (this.offset !== undefined) {
      return this.offset;
    }
    if (this.page) {
      return (this.page - 1) * this.getLimit();
    }
    return 0;
  }

  getLimit(): number {
    return this.limit || DEFAULT_PAGE_LIMIT;
  }

  @IsOptional()
  q?: string;
}

export class PaginationMetaDto {
  total: number;
  limit: number;
  offset: number;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
