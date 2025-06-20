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
  private readonly logger = new Logger(ActorsController.name);

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
    this.logger.log(`Fetching actors with params: ${JSON.stringify({ ...paginationParams, search })}`);
    try {
      const result = await this.actorsService.findAll(paginationParams, search);
      this.logger.debug(`Fetched ${result.items.length} actors out of ${result.total} total`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch actors: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch actors');
    }
  }

  @Public()
  @Get('search')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Search actors by name' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of actors matching search query',
    type: PaginationResponseDto
  })
  async search(
    @Query() paginationParams: PaginationParamsDto,
    @Query('q') query: string,
  ) {
    this.logger.log(`Searching actors with query: "${query}"`);
    try {
      const result = await this.actorsService.searchActorsByName(query.trim(), paginationParams);
      this.logger.debug(`Found ${result.items.length} actors matching "${query}"`);
      return result;
    } catch (error) {
      this.logger.error(`Search failed for query "${query}": ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to search actors');
    }
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get actor by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the actor with the specified ID',
    type: ActorResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    this.logger.log(`Fetching actor with ID: ${id}`);
    try {
      const actor = await this.actorsService.findOne(id);
      if (!actor) {
        this.logger.warn(`Actor not found with ID: ${id}`);
        throw new NotFoundException(`Actor with ID ${id} not found`);
      }
      this.logger.debug(`Successfully fetched actor: ${actor.name} (ID: ${id})`);
      return actor;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch actor ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch actor');
    }
  }

  @Public()
  @Get(':id/movies')
  @UseInterceptors(PaginationInterceptor)
  @ApiOperation({ summary: 'Get all movies for an actor' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of movies for the specified actor',
    type: PaginationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async getMoviesForActor(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() paginationParams: PaginationParamsDto,
  ) {
    this.logger.log(`Fetching movies for actor with ID: ${id}`);
    try {
      const result = await this.actorsService.getMoviesForActor(id, paginationParams);
      this.logger.debug(`Fetched ${result.data.length} movies for actor ${id}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Actor not found with ID: ${id}`);
        throw error;
      }
      this.logger.error(`Failed to fetch movies for actor ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch movies for actor');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new actor' })
  @ApiResponse({
    status: 201,
    description: 'The actor has been successfully created',
    type: ActorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createActorDto: CreateActorDto) {
    this.logger.log(`Creating new actor: ${createActorDto.name}`);
    try {
      const actor = await this.actorsService.create(createActorDto);
      this.logger.log(`Actor created successfully with ID: ${actor.id}`);
      return actor;
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.warn(`Invalid actor data: ${error.message}`);
        throw error;
      }
      this.logger.error(`Failed to create actor: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create actor');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an actor' })
  @ApiResponse({
    status: 200,
    description: 'The actor has been successfully updated',
    type: ActorResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    this.logger.log(`Updating actor with ID: ${id}`);
    try {
      const updatedActor = await this.actorsService.update(id, updateActorDto);
      if (!updatedActor) {
        this.logger.warn(`Actor not found for update with ID: ${id}`);
        throw new NotFoundException(`Actor with ID ${id} not found`);
      }
      this.logger.log(`Successfully updated actor with ID: ${id}`);
      return updatedActor;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        this.logger.warn(`Failed to update actor ${id}: ${error.message}`);
        throw error;
      }
      this.logger.error(`Error updating actor ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update actor');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an actor' })
  @ApiResponse({
    status: 204,
    description: 'The actor has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Actor not found' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.logger.log(`Deleting actor with ID: ${id}`);
    try {
      await this.actorsService.remove(id);
      return { message: 'Actor deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Actor not found for deletion with ID: ${id}`);
        throw error;
      }
      this.logger.error(`Failed to delete actor ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete actor');
    }
  }
}
