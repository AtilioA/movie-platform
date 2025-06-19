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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, getSchemaPath } from '@nestjs/swagger';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { ActorResponseDto } from './dto/actor-response.dto';
import { MoviesForActorResponseDto } from './dto/movies-for-actor-response.dto';
import { PaginationParamsDto } from '../shared/dto/pagination-params.dto';
import { PaginationResponseDto } from '../shared/dto/pagination-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationInterceptor } from '../shared/interceptors/pagination.interceptor';
import { Public } from '../shared/decorators/public.decorator';
import { MovieResponseDto } from '../movies/dto/movie-response.dto';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Public()
  @Get()
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get all actors with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of actors',
    type: PaginationResponseDto
  })
  async findAll(
    @Query() paginationParams: PaginationParamsDto,
    @Query('search') search?: string,
  ) {
    return this.actorsService.findAll(paginationParams, search);
  }

  @Public()
  @Get('search')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Search actors by name with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of actors matching search query',
    type: PaginationResponseDto
  })
  async search(
    @Query('q') query: string,
    @Query() paginationParams: PaginationParamsDto,
  ) {
    if (!query || !query.trim()) {
      return { items: [], total: 0, page: 1, totalPages: 0 };
    }
    return this.actorsService.searchActorsByName(query.trim(), paginationParams);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single actor by ID' })
  @ApiResponse({ status: 200, description: 'The actor was found', type: ActorResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.actorsService.findOne(id);
  }

  @Public()
  @Get(':id/movies')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get all movies for an actor with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies the actor has been in',
    type: PaginationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async getMoviesForActor(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() paginationParams: PaginationParamsDto
  ) {
    return this.actorsService.getMoviesForActor(id, paginationParams);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new actor' })
  @ApiResponse({
    status: 201,
    description: 'The actor has been successfully created',
    type: ActorResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createActorDto: CreateActorDto,
    @Request() req: any
  ) {
    return this.actorsService.create(createActorDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing actor' })
  @ApiResponse({
    status: 200,
    description: 'The actor has been successfully updated',
    type: ActorResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    return this.actorsService.update(id, updateActorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an actor' })
  @ApiResponse({ status: 200, description: 'The actor has been successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.actorsService.remove(id);
    return { message: 'Actor deleted successfully' };
  }
}
