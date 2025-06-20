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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingQueryDto } from './dto/rating-query.dto';
import { Rating } from './entities/rating.entity';
import { PaginationResult } from '../shared/interfaces/pagination-result.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Get()
  @ApiOperation({ summary: 'Get all ratings with optional filtering' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a list of ratings.', type: [Rating] })
  async findAll(@Query() query: RatingQueryDto): Promise<PaginationResult<Rating>> {
    return this.ratingsService.findAll(query);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get ratings for a specific movie' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return ratings for the specified movie.', type: [Rating] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Movie not found.' })
  async findByMovieId(
    @Param('movieId', new ParseUUIDPipe({ version: '4' })) movieId: string,
    @Query() query: Omit<RatingQueryDto, 'movieId'>,
  ): Promise<PaginationResult<Rating>> {
    return this.ratingsService.findAll({ ...query, movieId });
  }

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
