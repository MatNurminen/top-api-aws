import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { League } from './entities/league.entity';
import { LeagueLogo } from '../league-logos/entities/league-logo.entity';
import { LeagueByNation } from './entities/leagueByNation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager, Not, In } from 'typeorm';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type IsolationLevel =
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE';

describe('LeaguesService', () => {
  let service: LeaguesService;
  let leagueRepository: Repository<League>;
  let leagueLogoRepository: Repository<LeagueLogo>;
  let leagueByNationRepository: Repository<LeagueByNation>;

  const mockLeague = {
    id: 1,
    name: 'Premier League',
    short_name: 'EPL',
    color: '#FF0000',
    start_year: 1992,
    end_year: null,
    type_id: 1,
    logos: [],
  };

  const mockLeagueLogo = {
    id: 1,
    logo: 'logo.png',
    start_year: 2020,
    end_year: null,
    league_id: 1,
    league: mockLeague,
  };

  const mockLeagueByNation = {
    id: 1,
    short_name: 'EPL',
    flag: 'flag.png',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesService,
        {
          provide: getRepositoryToken(League),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            manager: {
              transaction: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
              delete: jest.fn(),
              find: jest.fn(),
              create: jest.fn(),
            } as Partial<EntityManager>,
          },
        },
        {
          provide: getRepositoryToken(LeagueLogo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(LeagueByNation),
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LeaguesService>(LeaguesService);
    leagueRepository = module.get<Repository<League>>(
      getRepositoryToken(League),
    );
    leagueLogoRepository = module.get<Repository<LeagueLogo>>(
      getRepositoryToken(LeagueLogo),
    );
    leagueByNationRepository = module.get<Repository<LeagueByNation>>(
      getRepositoryToken(LeagueByNation),
    );
  });

  describe('findAll', () => {
    it('should return an array of leagues with logos', async () => {
      jest.spyOn(leagueRepository, 'find').mockResolvedValue([mockLeague]);
      const result = await service.findAll();
      expect(result).toEqual([mockLeague]);
      expect(leagueRepository.find).toHaveBeenCalledWith({
        relations: ['logos'],
      });
    });
  });

  describe('findAllWithCurLogo', () => {
    it('should return leagues with current logos', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockLeague]),
      };
      jest
        .spyOn(leagueRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      const result = await service.findAllWithCurLogo();
      expect(result).toEqual([mockLeague]);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'league.logos',
        'logo',
        'logo.end_year IS NULL',
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('league.name', 'ASC');
    });
  });

  describe('leaguesByNation', () => {
    it('should return leagues by nation', async () => {
      jest
        .spyOn(leagueByNationRepository, 'query')
        .mockResolvedValue([mockLeagueByNation]);
      const result = await service.leaguesByNation({ nationId: 1 });
      expect(result).toEqual([mockLeagueByNation]);
      expect(leagueByNationRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [1],
      );
    });
  });

  describe('findOne', () => {
    it('should return a league with logos', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockLeague),
      };
      jest
        .spyOn(leagueRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockLeague);
      expect(queryBuilder.where).toHaveBeenCalledWith('league.id = :id', {
        id: 1,
      });
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'logos.start_year',
        'ASC',
      );
    });

    it('should throw NotFoundException if league not found', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      jest
        .spyOn(leagueRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a league without logos', async () => {
      const createLeagueDto: CreateLeagueDto = {
        name: 'Premier League',
        short_name: 'EPL',
        color: '#FF0000',
        start_year: 1992,
        type_id: 1,
      };
      jest.spyOn(leagueRepository, 'create').mockReturnValue(mockLeague);
      jest
        .spyOn(leagueRepository.manager, 'transaction')
        .mockImplementation(
          async (
            isolationLevelOrRunInTransaction:
              | IsolationLevel
              | ((manager: EntityManager) => Promise<any>),
            runInTransaction?: (manager: EntityManager) => Promise<any>,
          ) => {
            const manager = {
              save: jest.fn().mockResolvedValue(mockLeague),
            } as Partial<EntityManager>;
            const callback =
              typeof isolationLevelOrRunInTransaction === 'function'
                ? isolationLevelOrRunInTransaction
                : runInTransaction;
            if (!callback) {
              throw new Error('Transaction callback is missing');
            }
            return callback(manager as EntityManager);
          },
        );
      const result = await service.create(createLeagueDto);
      expect(result).toEqual({ ...mockLeague, logos: [] });
      expect(leagueRepository.create).toHaveBeenCalledWith(createLeagueDto);
    });

    it('should create a league with logos', async () => {
      const createLeagueDto: CreateLeagueDto = {
        name: 'Premier League',
        short_name: 'EPL',
        color: '#FF0000',
        start_year: 1992,
        type_id: 1,
        logos: [{ logo: 'logo.png', start_year: 2020 }],
      };
      jest.spyOn(leagueRepository, 'create').mockReturnValue(mockLeague);
      jest
        .spyOn(leagueLogoRepository, 'create')
        .mockReturnValue(mockLeagueLogo);
      jest
        .spyOn(leagueRepository.manager, 'transaction')
        .mockImplementation(
          async (
            isolationLevelOrRunInTransaction:
              | IsolationLevel
              | ((manager: EntityManager) => Promise<any>),
            runInTransaction?: (manager: EntityManager) => Promise<any>,
          ) => {
            const manager = {
              save: jest
                .fn()
                .mockResolvedValueOnce(mockLeague)
                .mockResolvedValueOnce([mockLeagueLogo]),
            } as Partial<EntityManager>;
            const callback =
              typeof isolationLevelOrRunInTransaction === 'function'
                ? isolationLevelOrRunInTransaction
                : runInTransaction;
            if (!callback) {
              throw new Error('Transaction callback is missing');
            }
            return callback(manager as EntityManager);
          },
        );
      const result = await service.create(createLeagueDto);
      expect(result).toEqual({ ...mockLeague, logos: [mockLeagueLogo] });
      expect(leagueLogoRepository.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if logo start_year is missing', async () => {
      const createLeagueDto: CreateLeagueDto = {
        name: 'Premier League',
        short_name: 'EPL',
        color: '#FF0000',
        start_year: 1992,
        type_id: 1,
        logos: [{ logo: 'logo.png' }],
      };
      await expect(service.create(createLeagueDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a league without logos', async () => {
      const updateLeagueDto: UpdateLeagueDto = {
        name: 'Updated League',
      };
      const updatedLeague = {
        ...mockLeague,
        ...updateLeagueDto,
        logos: mockLeague.logos,
      };
      const deleteMock = jest.fn();
      jest
        .spyOn(leagueRepository.manager, 'transaction')
        .mockImplementation(
          async (
            isolationLevelOrRunInTransaction:
              | IsolationLevel
              | ((manager: EntityManager) => Promise<any>),
            runInTransaction?: (manager: EntityManager) => Promise<any>,
          ) => {
            const manager = {
              findOne: jest.fn().mockResolvedValue(mockLeague),
              save: jest.fn().mockResolvedValue(updatedLeague),
              find: jest.fn().mockResolvedValue(mockLeague.logos),
              delete: deleteMock,
            } as Partial<EntityManager>;
            const callback =
              typeof isolationLevelOrRunInTransaction === 'function'
                ? isolationLevelOrRunInTransaction
                : runInTransaction;
            if (!callback) {
              throw new Error('Transaction callback is missing');
            }
            return callback(manager as EntityManager);
          },
        );
      const result = await service.update(1, updateLeagueDto);
      expect(result).toEqual(updatedLeague);
      expect(deleteMock).not.toHaveBeenCalled();
    });

    it('should update a league with logos', async () => {
      const updateLeagueDto: UpdateLeagueDto = {
        name: 'Updated League',
        logos: [{ id: 1, logo: 'new-logo.png', start_year: 2021 }],
      };
      const updatedLeague = {
        ...mockLeague,
        ...updateLeagueDto,
        logos: [mockLeagueLogo],
      };
      const deleteMock = jest.fn();
      jest
        .spyOn(leagueRepository.manager, 'transaction')
        .mockImplementation(
          async (
            isolationLevelOrRunInTransaction:
              | IsolationLevel
              | ((manager: EntityManager) => Promise<any>),
            runInTransaction?: (manager: EntityManager) => Promise<any>,
          ) => {
            const manager = {
              findOne: jest.fn().mockResolvedValue(mockLeague),
              save: jest.fn().mockResolvedValue(updatedLeague),
              create: jest.fn().mockImplementation((entity, data) => {
                return leagueLogoRepository.create(data);
              }),
              delete: deleteMock,
              find: jest.fn().mockResolvedValue([mockLeagueLogo]),
            } as Partial<EntityManager>;
            const callback =
              typeof isolationLevelOrRunInTransaction === 'function'
                ? isolationLevelOrRunInTransaction
                : runInTransaction;
            if (!callback) {
              throw new Error('Transaction callback is missing');
            }
            return callback(manager as EntityManager);
          },
        );
      jest
        .spyOn(leagueLogoRepository, 'create')
        .mockReturnValue(mockLeagueLogo);
      const result = await service.update(1, updateLeagueDto);
      expect(result).toEqual(updatedLeague);
      expect(leagueLogoRepository.create).toHaveBeenCalled();
      expect(deleteMock).toHaveBeenCalledWith(LeagueLogo, {
        league: { id: 1 },
        id: Not(In([1])),
      });
    });

    it('should throw NotFoundException if league not found', async () => {
      const deleteMock = jest.fn();
      jest
        .spyOn(leagueRepository.manager, 'transaction')
        .mockImplementation(
          async (
            isolationLevelOrRunInTransaction:
              | IsolationLevel
              | ((manager: EntityManager) => Promise<any>),
            runInTransaction?: (manager: EntityManager) => Promise<any>,
          ) => {
            const manager = {
              findOne: jest.fn().mockResolvedValue(null),
              delete: deleteMock,
            } as Partial<EntityManager>;
            const callback =
              typeof isolationLevelOrRunInTransaction === 'function'
                ? isolationLevelOrRunInTransaction
                : runInTransaction;
            if (!callback) {
              throw new Error('Transaction callback is missing');
            }
            return callback(manager as EntityManager);
          },
        );
      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a league', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockLeague);
      jest.spyOn(leagueRepository, 'remove').mockResolvedValue(mockLeague);
      const result = await service.remove(1);
      expect(result).toEqual(mockLeague);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(leagueRepository.remove).toHaveBeenCalledWith(mockLeague);
    });
  });
});
