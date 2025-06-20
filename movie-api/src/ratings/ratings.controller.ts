import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationInterceptor } from '../shared/interceptors/pagination.interceptor';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingQueryDto } from './dto/rating-query.dto';
import { Rating } from './entities/rating.entity';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new rating' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The rating has been successfully created.', type: Rating })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or movie not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingsService.create(createRatingDto);
  }

  @Public()
  @Get()
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get all ratings with optional filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return a paginated list of ratings.',
    type: Rating,
  })
  async findAll(
    @Query() paginationParams: PaginationParamsDto,
    @Query() query: RatingQueryDto,
  ): Promise<PaginationResult<Rating>> {
    return this.ratingsService.findAll({ ...paginationParams, ...query });
  }

  @Public()
  @Get('movie/:movieId')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get ratings for a specific movie with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return paginated ratings for the specified movie.',
    type: Rating,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found.' })
  async findByMovieId(
    @Param('movieId', new ParseUUIDPipe({ version: '4' })) movieId: string,
    @Query() paginationParams: PaginationParamsDto,
    @Query() query: Omit<RatingQueryDto, 'movieId'>,
  ): Promise<PaginationResult<Rating>> {
    return this.ratingsService.findAll({ ...paginationParams, ...query, movieId });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a rating by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the rating with the specified ID.', type: Rating })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rating not found.' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<Rating> {
    return this.ratingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a rating' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The rating has been successfully updated.', type: Rating })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rating not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    return this.ratingsService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a rating' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The rating has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Rating not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    return this.ratingsService.remove(id);
  }
}
