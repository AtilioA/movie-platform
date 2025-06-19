import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { RatingsService } from './ratings.service';
import { MoviesService } from '../movies/movies.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingQueryDto } from './dto/rating-query.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { createPaginationParams } from '../../test/test-utils';

describe('RatingsService', () => {
  let service: RatingsService;
  let ratingRepository: Repository<Rating>;
  let moviesService: MoviesService;

  // Mock data
  const mockRating = {
    id: '1',
    score: 5,
    comment: 'Great movie!',
    movieId: 'movie-1',
    movie: {
      id: 'movie-1',
      title: 'Test Movie',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Rating;

  // Mock repository
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  // Mock movies service
  const mockMoviesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    ratingRepository = module.get<Repository<Rating>>(
      getRepositoryToken(Rating),
    );
    moviesService = module.get<MoviesService>(MoviesService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createRatingDto: CreateRatingDto = {
      score: 5,
      comment: 'Great movie!',
      movieId: 'movie-1',
    };

    it('should create a new rating', async () => {
      mockMoviesService.findOne.mockResolvedValue({ id: 'movie-1' });
      mockRepository.create.mockReturnValue(mockRating);
      mockRepository.save.mockResolvedValue(mockRating);

      const result = await service.create(createRatingDto);

      expect(moviesService.findOne).toHaveBeenCalledWith(createRatingDto.movieId);
      expect(ratingRepository.create).toHaveBeenCalledWith(createRatingDto);
      expect(ratingRepository.save).toHaveBeenCalledWith(mockRating);
      expect(result).toEqual(mockRating);
    });

    it('should throw BadRequestException if movie does not exist', async () => {
      mockMoviesService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.create(createRatingDto)).rejects.toThrow(BadRequestException);
      expect(moviesService.findOne).toHaveBeenCalledWith(createRatingDto.movieId);
    });
  });

  describe('findAll', () => {
    const paginationParams = createPaginationParams({
      page: 1,
      limit: 10,
    });
    const query: RatingQueryDto = {
      ...paginationParams,
      movieId: 'movie-1',
    };

    it('should return paginated ratings', async () => {
      const mockRatings = [mockRating];
      const total = 1;
      
      mockRepository.findAndCount.mockResolvedValue([mockRatings, total]);

      const result = await service.findAll(query);

      expect(ratingRepository.findAndCount).toHaveBeenCalledWith({
        where: { movieId: query.movieId },
        take: paginationParams.getLimit(),
        skip: paginationParams.getOffset(),
        relations: ['movie'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        items: mockRatings,
        total,
        page: paginationParams.page,
        totalPages: Math.ceil(total / paginationParams.limit),
      });
    });
  });

  describe('findOne', () => {
    it('should return a rating by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockRating);

      const result = await service.findOne('1');

      expect(ratingRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['movie'],
      });
      expect(result).toEqual(mockRating);
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateRatingDto: UpdateRatingDto = {
      score: 4,
      comment: 'Updated comment',
    };

    it('should update a rating', async () => {
      const updatedRating = { ...mockRating, ...updateRatingDto };
      mockRepository.preload.mockResolvedValue(updatedRating);
      mockRepository.save.mockResolvedValue(updatedRating);

      const result = await service.update('1', updateRatingDto);

      expect(ratingRepository.preload).toHaveBeenCalledWith({
        id: '1',
        ...updateRatingDto,
      });
      expect(ratingRepository.save).toHaveBeenCalledWith(updatedRating);
      expect(result).toEqual(updatedRating);
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRepository.preload.mockResolvedValue(undefined);

      await expect(service.update('nonexistent', updateRatingDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a rating', async () => {
      mockRepository.findOne.mockResolvedValue(mockRating);
      mockRepository.remove.mockResolvedValue(mockRating);

      await service.remove('1');

      expect(ratingRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(ratingRepository.remove).toHaveBeenCalledWith(mockRating);
    });

    it('should throw NotFoundException if rating not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
