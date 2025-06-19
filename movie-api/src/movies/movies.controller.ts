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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResponseDto } from '../shared/dto/pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationInterceptor } from '../shared/interceptors/pagination.interceptor';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
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
    return this.moviesService.findAllMovies(paginationParams, search);
  }

  @Public()
  @Get('search')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Search movies by title with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies matching search query',
    type: PaginationResponseDto
  })
  async search(
    @Query('q') query: string,
    @Query() paginationParams: PaginationParamsDto,
  ) {
    if (!query || !query.trim()) {
      return { items: [], total: 0, page: 1, totalPages: 0 };
    }
    return this.moviesService.searchMoviesByTitle(query.trim(), paginationParams);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested movie',
    type: MovieResponseDto
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOneMovie(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created',
    type: MovieResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @Request() req: any
  ) {
    return this.moviesService.createMovie(createMovieDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated',
    type: MovieResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'The movie has been successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async remove(@Param('id') id: string) {
    await this.moviesService.removeMovie(id);
    return { message: 'Movie deleted successfully' };
  }
}
