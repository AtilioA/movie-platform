import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

type MockRepository<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends object>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const createMockQueryBuilder = () => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: MockRepository<Movie>;
  let mockMovie: Movie;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    // Create a mock movie instance
    mockMovie = new Movie();
    mockMovie.id = '1';
    mockMovie.title = 'Test Movie';
    mockMovie.actors = [];
    mockMovie.ratings = [];
    mockMovie.createdAt = new Date();
    mockMovie.updatedAt = new Date();

    // Create mock query builder
    mockQueryBuilder = createMockQueryBuilder();
    
    // Create mock repository
    repository = createMockRepository<Movie>();

    // Setup default mock implementations
    (repository.create as jest.Mock).mockImplementation((entity) => ({
      ...entity,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    (repository.save as jest.Mock).mockImplementation((entity) => Promise.resolve(entity));
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
  });

  describe('findAllMovies', () => {
    it('should return paginated movies', async () => {
      const paginationParams = { limit: 10, offset: 0 };
      const mockMovies = [mockMovie];
      const mockResult = {
        items: mockMovies,
        total: 1,
        limit: 10,
        offset: 0,
      };

      // Mock the paginate method
      jest.spyOn(service as any, 'paginate').mockResolvedValue(mockResult);

      const result = await service.findAllMovies(paginationParams);

      expect((service as any).paginate).toHaveBeenCalledWith(
        1, // page (offset / limit + 1)
        10, // limit
        {
          where: {},
          relations: ['actors'],
          order: { title: 'ASC' }
        }
      );
      expect(result).toEqual(mockResult);
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
  });

  describe('searchMoviesByTitle', () => {
    it('should search movies by title', async () => {
      const searchTerm = 'test';
      const mockMovies = [mockMovie];

      // Mock the repository's find method
      (repository.find as jest.Mock).mockResolvedValue(mockMovies);

      const result = await service.searchMoviesByTitle(searchTerm);

      expect(repository.find).toHaveBeenCalledWith({
        where: { 
          title: expect.any(Object) // Expecting an ILike condition
        },
        take: 10,
      });
      
      // Verify the ILike condition was used with the correct search term
      const findCall = (repository.find as jest.Mock).mock.calls[0][0];
      expect(findCall.where.title).toBeDefined();
      expect(findCall.where.title._type).toBe('ilike');
      expect(findCall.where.title._value).toBe(`%${searchTerm}%`);
      
      expect(result).toEqual(mockMovies);
      expect(result).toEqual(mockMovies);
    });
  });
});
