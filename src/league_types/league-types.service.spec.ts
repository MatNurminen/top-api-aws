import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LeagueTypesService } from './league-types.service';
import { LeagueType } from './entities/league-type.entity';

describe('LeagueTypesService', () => {
  let service: LeagueTypesService;
  let leagueTypeRepository: Repository<LeagueType>;

  const mockLeagueType = {
    id: 1,
    name: 'League local',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeagueTypesService,
        {
          provide: getRepositoryToken(LeagueType),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeagueTypesService>(LeagueTypesService);
    leagueTypeRepository = module.get<Repository<LeagueType>>(
      getRepositoryToken(LeagueType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of league_types', async () => {
      jest
        .spyOn(leagueTypeRepository, 'find')
        .mockResolvedValue([mockLeagueType]);
      const result = await service.findAll();
      expect(result).toEqual([mockLeagueType]);
      expect(leagueTypeRepository.find).toHaveBeenCalledWith({});
    });

    it('should return an empty array if no league_types are found', async () => {
      jest.spyOn(leagueTypeRepository, 'find').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(leagueTypeRepository.find).toHaveBeenCalledWith({});
    });
  });
});
