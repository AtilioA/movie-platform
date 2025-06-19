import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, ILike } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { MoviesService } from './movies.service';
import { createPaginationParams } from '../../test/test-utils';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';

// Simplified mock repository type that avoids type constraints
type AnyFunction = (...args: any[]) => any;
interface MockRepository extends Record<string, jest.Mock> {}

// Helper function to create a mock repository
const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn().mockResolvedValue([[], 0]),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getOne: jest.fn(),
  })),
});

// Helper function to create a mock query builder
const createMockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: MockRepository;

  // Helper function to create a mock movie
  const createMockMovie = (overrides: Partial<Movie> = {}): Movie => {
    const baseMovie: Movie = {
      id: '1',
      title: 'Test Movie',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Movie;

    return {
      ...baseMovie,
      ...overrides,
    };
  };

  // Test DTO interfaces for testing
  interface TestCreateMovieDto {
    title: string;
    actorIds: string[];
  }

  interface TestUpdateMovieDto {
    title?: string;
    actorIds?: string[];
  }

  let mockMovie: Movie;
  let mockQueryBuilder: {
    leftJoinAndSelect: jest.Mock;
    where: jest.Mock;
    take: jest.Mock;
    getMany: jest.Mock;
    getOne: jest.Mock;
  };

  beforeEach(async () => {
        // Create a mock movie with all required properties
    mockMovie = createMockMovie({
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Test Movie',
      actors: [],
      ratings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create mock query builder
    mockQueryBuilder = createMockQueryBuilder();

    // Create mock repository
    repository = createMockRepository();

    // Setup default mock implementations
    (repository.create as jest.Mock).mockImplementation((entity: any) => {
      // If actorIds are provided, map them to actor objects
      const actors = 'actorIds' in entity
        ? entity.actorIds.map((id: number) => ({ id }))
        : [];

      return {
        ...entity,
        id: '1',
        actors,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    (repository.save as jest.Mock).mockImplementation((entity: Movie) => Promise.resolve(entity));
    (repository.findOne as jest.Mock).mockResolvedValue(mockMovie);
    (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 } as DeleteResult);
    (repository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
    (mockQueryBuilder.getMany as jest.Mock).mockResolvedValue([mockMovie]);
    (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(mockMovie);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    it('should successfully create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        actorIds: [],
      };

      (repository.create as jest.Mock).mockReturnValue(mockMovie);
      (repository.save as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.createMovie(createMovieDto);

      expect(repository.create).toHaveBeenCalledWith(createMovieDto);
      expect(repository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });

    it('should handle database errors when creating a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        actorIds: [],
      };

      (repository.create as jest.Mock).mockReturnValue(mockMovie);
      const dbError = new Error('Database connection failed');
      (repository.save as jest.Mock).mockRejectedValue(dbError);

      await expect(service.createMovie(createMovieDto)).rejects.toThrow('Database connection failed');
    });

    it('should create a movie with actors when actorIds are provided', async () => {
      const createMovieDto = {
        title: 'Movie with Actors',
        actorIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
          '123e4567-e89b-12d3-a456-426614174003'
        ],
      };

      const mockMovieWithActors = {
        ...mockMovie,
        title: createMovieDto.title,
        actors: createMovieDto.actorIds.map(id => ({ id: String(id) })),
      };

      // Mock the create method to return the same object it receives
      repository.create.mockImplementation((dto) => ({
        ...dto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      repository.save.mockResolvedValue(mockMovieWithActors);

      const result = await service.createMovie(createMovieDto);

      // Verify the repository.create was called with the DTO
      expect(repository.create).toHaveBeenCalledWith(createMovieDto);

      // Verify the save was called with the movie including actors
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...createMovieDto,
        actors: expect.arrayContaining(createMovieDto.actorIds.map(id => expect.objectContaining({ id: String(id) })))
      }));

      expect(result.actors).toHaveLength(3);
    });
  });

  describe('findAllMovies', () => {
    it('should return paginated movies', async () => {
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });
      const mockMovies = [mockMovie];

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      const result = await service.findAllMovies(paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 10,
        skip: 0
      });

      // Verify the result structure
      expect(result).toEqual({
        items: mockMovies,
        total: 1,
        page: 1,
        totalPages: 1
      });
    });

    it('should handle empty results', async () => {
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });

      // Mock findAndCount to return empty results
      repository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAllMovies(paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 10,
        skip: 0
      });

      // Verify the result structure
      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    });

    it('should handle search term', async () => {
      const paginationParams = createPaginationParams({ limit: 5, offset: 10, page: 3 });
      const searchTerm = 'test';
      const mockMovies = [mockMovie];

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      const result = await service.findAllMovies(paginationParams, searchTerm);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { title: ILike(`%${searchTerm}%`) },
        relations: ['actors'],
        order: { title: 'ASC' },
        take: paginationParams.getLimit(),
        skip: paginationParams.getOffset()
      });

      // Verify the result structure
      expect(result).toEqual({
        items: mockMovies,
        total: 1,
        page: 3,
        totalPages: 1
      });
    });

    it('should handle pagination parameters correctly', async () => {
      const paginationParams = {
        limit: 5,
        offset: 10,
        getLimit: () => 5,
        getOffset: () => 10,
        page: 3
      };
      const mockMovies = [mockMovie];

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      const result = await service.findAllMovies(paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 5,
        skip: 10
      });

      // Verify the result structure
      expect(result).toEqual({
        items: mockMovies,
        total: 1,
        page: 3,
        totalPages: 1
      });
    });
  });

  describe('findOneMovie', () => {
    it('should return a movie by id', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.findOneMovie('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['actors', 'ratings'],
      });
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOneMovie('999')).rejects.toThrow(NotFoundException);
    });

    it('should handle invalid ID format', async () => {
      const invalidId = 'invalid-id';
      (repository.findOne as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(service.findOneMovie(invalidId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: invalidId },
        relations: ['actors', 'ratings'],
      });
    });

    it('should include related actors and ratings', async () => {
      const movieWithRelations = createMockMovie({
        actors: [{ id: '1', name: 'Test Actor' }] as any[],
        ratings: [{ id: '1', rating: 5 }] as any[]
      });

      (repository.findOne as jest.Mock).mockResolvedValue(movieWithRelations);

      const result = await service.findOneMovie('1');

      expect(result.actors).toBeDefined();
      expect(result.ratings).toBeDefined();
      expect(result.actors).toHaveLength(1);
      expect(result.ratings).toHaveLength(1);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Title' };
      const updatedMovie = { ...mockMovie, title: 'Updated Title' };

      // Mock findOneMovie to return a movie
      jest.spyOn(service, 'findOneMovie').mockResolvedValue(mockMovie as any);
      (repository.save as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await service.updateMovie('1', updateMovieDto);

      expect(service.findOneMovie).toHaveBeenCalledWith('1');
      expect(repository.save).toHaveBeenCalledWith(updatedMovie);
      expect(result).toEqual(updatedMovie);
    });

    it('should handle partial updates', async () => {
      const updateMovieDto: TestUpdateMovieDto = {
        title: 'New Title',
        actorIds: [
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002'
        ]
      };

      const updatedMovie = {
        ...mockMovie,
        title: 'New Title',
        actors: [
          { id: '123e4567-e89b-12d3-a456-426614174001' },
          { id: '123e4567-e89b-12d3-a456-426614174002' }
        ]
      };

      jest.spyOn(service, 'findOneMovie').mockResolvedValue(mockMovie as any);
      (repository.save as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await service.updateMovie('1', updateMovieDto);

      expect(result.title).toBe('New Title');
      expect(result.actors).toHaveLength(2);
    });

    it('should handle empty update DTO', async () => {
      const updateMovieDto: TestUpdateMovieDto = {};

      jest.spyOn(service, 'findOneMovie').mockResolvedValue(mockMovie as any);
      (repository.save as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.updateMovie('1', updateMovieDto);

      expect(repository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie not found', async () => {
      const updateMovieDto: Partial<UpdateMovieDto> = { title: 'New Title' };

      jest.spyOn(service, 'findOneMovie').mockRejectedValue(new NotFoundException());

      await expect(service.updateMovie('999', updateMovieDto)).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('getActorsForMovie', () => {
    it('should return paginated actors for a movie', async () => {
      const mockActors = [
        { id: '1', name: 'Actor 1', createdAt: new Date(), updatedAt: new Date(), movies: [] },
        { id: '2', name: 'Actor 2', createdAt: new Date(), updatedAt: new Date(), movies: [] },
      ];

      const mockMovie = {
        id: '1',
        title: 'Test Movie',
        actors: mockActors,
      };

      (repository.findOne as jest.Mock).mockResolvedValue(mockMovie);
      
      // Mock the query builder
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockMovie]),
      };
      
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      // Create a proper PaginationParamsDto mock
      class MockPaginationParamsDto {
        limit = 10;
        offset = 0;
        page = 1;
        
        getLimit() {
          return this.limit;
        }
        
        getOffset() {
          return this.offset;
        }
      }

      const paginationParams = new MockPaginationParamsDto();

      const result = await service.getActorsForMovie('1', paginationParams);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['actors'],
      });

      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('1');
      expect(result.items[1].id).toBe('2');
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should throw NotFoundException when movie is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      
      // Create a proper PaginationParamsDto mock
      class MockPaginationParamsDto {
        limit = 10;
        offset = 0;
        page = 1;
        
        getLimit() {
          return this.limit;
        }
        
        getOffset() {
          return this.offset;
        }
      }
      
      const paginationParams = new MockPaginationParamsDto();

      await expect(service.getActorsForMovie('999', paginationParams)).rejects.toThrow(
        new NotFoundException('Movie with ID 999 not found')
      );
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.removeMovie('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if movie not found', async () => {
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.removeMovie('999')).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors during deletion', async () => {
      const dbError = new Error('Database connection failed');
      (repository.delete as jest.Mock).mockRejectedValue(dbError);

      await expect(service.removeMovie('1')).rejects.toThrow('Database connection failed');
    });

    it('should handle empty or invalid ID', async () => {
      (repository.delete as jest.Mock)
        .mockResolvedValueOnce({ affected: 0 })
        .mockResolvedValueOnce({ affected: 0 })
        .mockResolvedValueOnce({ affected: 0 });

      await expect(service.removeMovie('')).rejects.toThrow(NotFoundException);
      await expect(service.removeMovie(' ')).rejects.toThrow(NotFoundException);
      // @ts-expect-error Testing invalid input
      await expect(service.removeMovie(null)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchMoviesByTitle', () => {
    it('should search movies by title with pagination', async () => {
      const searchTerm = 'test';
      const mockMovies = [mockMovie];
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      const result = await service.searchMoviesByTitle(searchTerm, paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { title: ILike(`%${searchTerm}%`) },
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 10,
        skip: 0
      });

      // Verify the result structure
      expect(result).toEqual({
        items: mockMovies,
        total: 1,
        page: 1,
        totalPages: 1
      });
    });

    it('should return empty result when search term is empty', async () => {
      const result = await service.searchMoviesByTitle('');
      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });

    it('should return empty result when search term is whitespace', async () => {
      const result = await service.searchMoviesByTitle('   ');
      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });
    });

    it('should handle pagination parameters correctly', async () => {
      const searchTerm = 'test';
      const paginationParams = {
        limit: 5,
        offset: 10,
        getLimit: () => 5,
        getOffset: () => 10,
        page: 3
      };
      const mockMovies = [mockMovie];

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      const result = await service.searchMoviesByTitle(searchTerm, paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { title: ILike(`%${searchTerm}%`) },
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 5,
        skip: 10
      });

      // Verify the result structure
      expect(result).toEqual({
        items: mockMovies,
        total: 1,
        page: 3,
        totalPages: 1
      });
    });

    it('should handle special characters in search term', async () => {
      const specialChars = 'test!@#$%^&*()_+{}|:\"<>?`~[]';
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });
      const mockMovies = [mockMovie];

      // Mock findAndCount to return the expected result
      repository.findAndCount.mockResolvedValue([mockMovies, 1]);

      await service.searchMoviesByTitle(specialChars, paginationParams);

      // Verify the repository was called with the correct parameters
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { title: ILike(`%${specialChars}%`) },
        relations: ['actors'],
        order: { title: 'ASC' },
        take: 10,
        skip: 0
      });
    });
  });
});
