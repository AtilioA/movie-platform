import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseGuards,
  Request,
  Patch,
  ParseUUIDPipe,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, getSchemaPath } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { MovieActorResponseDto } from './dto/movie-actor-response.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResponseDto } from '../shared/dto/pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationInterceptor } from '../shared/interceptors/pagination.interceptor';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Public()
  @Get()
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get all movies with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies',
    type: PaginationResponseDto
  })
  async findAll(
    @Query() paginationParams: PaginationParamsDto,
    @Query('search') search?: string,
  ) {
    this.logger.log(`Fetching movies with params: ${JSON.stringify({ ...paginationParams, search })}`);
    try {
      const result = await this.moviesService.findAllMovies(paginationParams, search);
      this.logger.debug(`Fetched ${result.items.length} movies out of ${result.total} total`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch movies: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch movies');
    }
  }

  @Public()
  @Get('search')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Search movies by title' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies matching search query',
    type: PaginationResponseDto
  })
  async search(
    @Query() paginationParams: PaginationParamsDto,
    @Query('q') query: string,
  ) {
    this.logger.log(`Searching movies with query: "${query}"`);
    try {
      const result = await this.moviesService.searchMoviesByTitle(query, paginationParams);
      this.logger.debug(`Found ${result.items.length} movies matching "${query}"`);
      return result;
    } catch (error) {
      this.logger.error(`Search failed for query "${query}": ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search movies');
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the movie with the specified ID',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`Fetching movie with ID: ${id}`);
    try {
      const movie = await this.moviesService.findOne(id);
      if (!movie) {
        this.logger.warn(`Movie not found with ID: ${id}`);
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
      this.logger.debug(`Successfully fetched movie: ${movie.title} (ID: ${id})`);
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch movie ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch movie');
    }
  }

  @Public()
  @Get(':id/actors')
  @ApiOperation({ summary: 'Get all actors in a movie' })
  @ApiResponse({
    status: 200,
    description: 'List of actors in the specified movie',
    type: PaginationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async getActors(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() paginationParams: PaginationParamsDto
  ) {
    this.logger.log(`Fetching actors for movie with ID: ${id}`);
    try {
      const result = await this.moviesService.getActorsForMovie(id, paginationParams);
      this.logger.debug(`Fetched ${result.data.length} actors for movie ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch actors for movie ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch actors');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createMovieDto: CreateMovieDto, @Request() req: any) {
    this.logger.log(`Creating new movie: ${createMovieDto.title}`);
    try {
      const movie = await this.moviesService.createMovie(createMovieDto);
      this.logger.log(`Movie created successfully with ID: ${movie.id}`);
      return movie;
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Invalid movie data: ${error.message}`);
        throw error;
      }
      this.logger.error(`Failed to create movie: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create movie');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() req: any,
  ) {
    this.logger.log(`Updating movie with ID: ${id}`);
    try {
      const updatedMovie = await this.moviesService.updateMovie(id, updateMovieDto);
      if (!updatedMovie) {
        this.logger.warn(`Movie not found for update with ID: ${id}`);
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
      this.logger.log(`Successfully updated movie with ID: ${id}`);
      return updatedMovie;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        this.logger.warn(`Failed to update movie ${id}: ${error.message}`);
        throw error;
      }
      this.logger.error(`Error updating movie ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({
    status: 204,
    description: 'The movie has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Request() req: any,
  ) {
    this.logger.log(`Deleting movie with ID: ${id}`);
    try {
      await this.moviesService.removeMovie(id);
      this.logger.log(`Successfully deleted movie with ID: ${id}`);
      return { message: 'Movie deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Movie not found for deletion with ID: ${id}`);
        throw error;
      }
      this.logger.error(`Failed to delete movie ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete movie');
    }
  }
}
