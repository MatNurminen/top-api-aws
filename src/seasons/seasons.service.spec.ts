import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsService } from './seasons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSeasonDto } from './dto/create-season.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

describe('SeasonsService', () => {
  let service: SeasonsService;
  let seasonRepository: Repository<Season>;

  const mockSeason = {
    id: 2025,
    name: '2025-26',
    logo: 'nhl25.jpg',
    link: '/rosters?league=14&season=2025',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        {
          provide: getRepositoryToken(Season),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeasonsService>(SeasonsService);
    seasonRepository = module.get<Repository<Season>>(
      getRepositoryToken(Season),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of seasons', async () => {
      jest.spyOn(seasonRepository, 'find').mockResolvedValue([mockSeason]);
      const result = await service.findAll();
      expect(result).toEqual([mockSeason]);
      expect(seasonRepository.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
      });
    });

    it('should return an empty array if no seasons are found', async () => {
      jest.spyOn(seasonRepository, 'find').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(seasonRepository.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a season by id', async () => {
      jest.spyOn(seasonRepository, 'findOne').mockResolvedValue(mockSeason);
      const result = await service.findOne(1);
      expect(result).toEqual(mockSeason);
      expect(seasonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if season not found', async () => {
      jest.spyOn(seasonRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException(`Season #999 not found`),
      );
      expect(seasonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('create', () => {
    it('should create and return a season', async () => {
      const createSeasonDto: CreateSeasonDto = {
        id: 2025,
        name: '2025-26',
        logo: 'nhl25.jpg',
        link: '/rosters?league=14&season=2025',
      };
      const createdSeason = { ...mockSeason, ...createSeasonDto };
      jest.spyOn(seasonRepository, 'create').mockReturnValue(createdSeason);
      jest.spyOn(seasonRepository, 'save').mockResolvedValue(createdSeason);

      const result = await service.create(createSeasonDto);

      expect(result).toEqual(createdSeason);
      expect(seasonRepository.create).toHaveBeenCalledWith(createSeasonDto);
      expect(seasonRepository.save).toHaveBeenCalledWith(createdSeason);
    });

    it('should throw BadRequestException if name is missing', async () => {
      const createSeasonDto = {
        id: 2025,
        logo: 'nhl25.jpg',
        link: '/rosters?league=14&season=2025',
      };
      const dtoInstance = plainToClass(CreateSeasonDto, createSeasonDto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });

  describe('update', () => {
    it('should update and return the season', async () => {
      const updateDto = { logo: 'nhl26.jpg' };

      jest
        .spyOn(seasonRepository, 'preload')
        .mockResolvedValue({ ...mockSeason, ...updateDto });
      jest
        .spyOn(seasonRepository, 'save')
        .mockResolvedValue({ ...mockSeason, ...updateDto });

      const result = await service.update(2025, updateDto);

      expect(seasonRepository.preload).toHaveBeenCalledWith({
        id: 2025,
        ...updateDto,
      });
      expect(seasonRepository.save).toHaveBeenCalledWith({
        ...mockSeason,
        ...updateDto,
      });
      expect(result.logo).toBe('nhl26.jpg');
    });

    it('should throw NotFoundException if season not found', async () => {
      jest.spyOn(seasonRepository, 'preload').mockResolvedValue(null);

      await expect(service.update(999, { logo: 'Unknown' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the season', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSeason);
      jest.spyOn(seasonRepository, 'remove').mockResolvedValue(mockSeason);

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(seasonRepository.remove).toHaveBeenCalledWith(mockSeason);
      expect(result).toEqual(mockSeason);
    });

    it('should throw NotFoundException if season to remove not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
