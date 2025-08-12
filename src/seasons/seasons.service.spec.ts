import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsService } from './seasons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SeasonsService', () => {
  let service: SeasonsService;
  let seasonRepository: Repository<Season>;

  const mockSeason = {
    id: 1,
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

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

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
});
