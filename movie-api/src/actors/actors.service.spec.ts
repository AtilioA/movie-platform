import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorsService } from './actors.service';
import { Actor } from './entities/actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { NotFoundException } from '@nestjs/common';
import { createPaginationParams } from '../../test/test-utils';

describe('ActorsService', () => {
  let service: ActorsService;
  let repository: Repository<Actor>;


  const mockActor = {
    id: '1',
    name: 'Test Actor',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Actor;

  const mockActorResponse = {
    id: '1',
    name: 'Test Actor',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActorsService,
        {
          provide: getRepositoryToken(Actor),
          useValue: {
            create: jest.fn().mockReturnValue(mockActor),
            save: jest.fn().mockResolvedValue(mockActor),
            findAndCount: jest.fn().mockResolvedValue([[mockActor], 1]),
            findOne: jest.fn().mockResolvedValue(mockActor),
            preload: jest.fn().mockResolvedValue(mockActor),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ActorsService>(ActorsService);
    repository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new actor', async () => {
      const createActorDto: CreateActorDto = {
        name: 'Test Actor',
      };

      const result = await service.create(createActorDto);

      expect(repository.create).toHaveBeenCalledWith(createActorDto);
      expect(repository.save).toHaveBeenCalledWith(mockActor);
      expect(result).toEqual(mockActorResponse);
    });
  });

  describe('findAll', () => {
    it('should return actors matching search term', async () => {
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });
      const search = 'test';
      
      const result = await service.findAll(paginationParams, search);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { name: expect.any(Object) },
        take: paginationParams.limit,
        skip: paginationParams.offset,
        order: { name: 'ASC' },
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should return all actors when no search term is provided', async () => {
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });
      const search = '';   
      await service.findAll(paginationParams, search);
      
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        take: paginationParams.limit,
        skip: paginationParams.offset,
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an actor by id', async () => {
      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['movies'],
      });
      expect(result).toEqual(mockActorResponse);
    });

    it('should throw NotFoundException when actor is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an actor', async () => {
      const updateActorDto: UpdateActorDto = {
        name: 'Updated Actor',
      };

      const result = await service.update('1', updateActorDto);

      expect(repository.preload).toHaveBeenCalledWith({
        id: '1',
        ...updateActorDto,
      });
      expect(repository.save).toHaveBeenCalledWith(mockActor);
      expect(result).toEqual(mockActorResponse);
    });

    it('should throw NotFoundException when updating non-existent actor', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValueOnce(undefined);

      await expect(service.update('999', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an actor', async () => {
      await service.remove('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when removing non-existent actor', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValueOnce({ affected: 0 } as any);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMoviesForActor', () => {
    it('should return paginated movies for an actor', async () => {
      const mockMovies = [
        { id: '1', title: 'Movie 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Movie 2', createdAt: new Date(), updatedAt: new Date() },
      ];

      const mockActorWithMovies = {
        id: '1',
        name: 'Test Actor',
        movies: mockMovies,
      };

      // Mock the query builder
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockActorWithMovies]),
      };
      
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
      (repository.findOne as jest.Mock).mockResolvedValue(mockActorWithMovies);

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

      const result = await service.getMoviesForActor('1', paginationParams);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['movies'],
      });

      expect(result.items).toHaveLength(2);
      expect(result.items[0].id).toBe('1');
      expect(result.items[1].id).toBe('2');
      expect(result.items[0].title).toBe('Movie 1');
      expect(result.items[1].title).toBe('Movie 2');
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should throw NotFoundException when actor is not found', async () => {
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

      await expect(service.getMoviesForActor('999', paginationParams)).rejects.toThrow(
        new NotFoundException('Actor with ID 999 not found')
      );
    });
  });

  describe('searchActorsByName', () => {
    it('should search actors by name with pagination', async () => {
      const name = 'test';
      const paginationParams = createPaginationParams({ limit: 10, offset: 0 });
      
      const result = await service.searchActorsByName(name, paginationParams);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { name: expect.any(Object) },
        take: paginationParams.getLimit(),
        skip: paginationParams.getOffset(),
        order: { name: 'ASC' },
      });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });
});
