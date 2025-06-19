import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResult } from '../interfaces/pagination-result.interface';
import { PaginationResponseDto } from '../dto/pagination-response.dto';

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<PaginationResult<T>, PaginationResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<PaginationResponseDto<T>> {
    return next.handle().pipe(
      map((result: PaginationResult<T>) => {
        if (!result || !('items' in result) || !('total' in result)) {
          // If the result doesn't match the pagination format, return it as is
          return result as unknown as PaginationResponseDto<T>;
        }

        const { items, total, page } = result;
        const limit = items.length;
        const offset = (page - 1) * limit;

        return new PaginationResponseDto(items, { total, limit, offset });
      }),
    );
  }
}
