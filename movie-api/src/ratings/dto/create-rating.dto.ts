import { PickType } from '@nestjs/swagger';
import { BaseRatingDto } from './base-rating.dto';

export class CreateRatingDto extends PickType(BaseRatingDto, ['score', 'comment', 'movieId'] as const) {}
