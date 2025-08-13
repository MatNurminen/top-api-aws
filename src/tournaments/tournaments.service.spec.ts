import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { TournamentsService } from './tournaments.service';
import { Tournament } from './entities/tournament.entity';
import { League } from '../leagues/entities/league.entity';
import { Season } from '../seasons/entities/season.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentByLeague } from './entities/tournamentByLeague.entity';

jest.mock('../common/utils/entity-validator.util', () => ({
  validateEntityExists: jest.fn(),
}));

describe('TournamentsService', () => {
  let service: TournamentsService;
  let tournamentRepository: Repository<Tournament>;
  let seasonRepository: Repository<Season>;
  let leagueRepository: Repository<League>;

  const mockTournament = {
    id: 1,
    season_id: 2012,
    league_id: 2,
    league: {
      id: 2,
      name: 'Liiga',
      short_name: 'Liiga',
      color: null,
      start_year: 2012,
      end_year: null,
      type_id: 1,
    },
  };

  const mockTournamentByLeague = {
    id: 1,
    season_id: 1,
    league_id: 1,
    season: '2023',
    league: 'Liiga',
    logo: 'logo.png',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentsService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            query: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Season),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(League),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TournamentsService>(TournamentsService);
    tournamentRepository = module.get<Repository<Tournament>>(
      getRepositoryToken(Tournament),
    );
    seasonRepository = module.get<Repository<Season>>(
      getRepositoryToken(Season),
    );
    leagueRepository = module.get<Repository<League>>(
      getRepositoryToken(League),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of tournaments', async () => {
      jest
        .spyOn(tournamentRepository, 'find')
        .mockResolvedValue([mockTournament]);
      const result = await service.findAll();
      expect(result).toEqual([mockTournament]);
      expect(tournamentRepository.find).toHaveBeenCalledWith({});
    });

    it('should return an empty array if no seasons are found', async () => {
      jest.spyOn(tournamentRepository, 'find').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(tournamentRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tournament with league', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTournament),
      };
      jest
        .spyOn(tournamentRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockTournament);
      expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'tournament.league',
        'league',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith('tournament.id = :id', {
        id: 1,
      });
    });

    it('should throw NotFoundException if tournament not found', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      jest
        .spyOn(tournamentRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a tournament', async () => {
      const createTournamentDto: CreateTournamentDto = {
        season_id: 1,
        league_id: 1,
      };
      jest
        .spyOn(seasonRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Season);
      jest
        .spyOn(leagueRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as League);
      jest
        .spyOn(tournamentRepository, 'create')
        .mockReturnValue(mockTournament);
      jest
        .spyOn(tournamentRepository, 'save')
        .mockResolvedValue(mockTournament);
      const result = await service.create(createTournamentDto);
      expect(result).toEqual(mockTournament);
      expect(tournamentRepository.create).toHaveBeenCalledWith(
        createTournamentDto,
      );
      expect(tournamentRepository.save).toHaveBeenCalledWith(mockTournament);
    });

    it('should throw NotFoundException if season not found', async () => {
      const createTournamentDto: CreateTournamentDto = {
        season_id: 999,
        league_id: 1,
      };
      jest.spyOn(seasonRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(leagueRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as League);
      jest
        .spyOn(
          require('../common/utils/entity-validator.util'),
          'validateEntityExists',
        )
        .mockImplementation((repo, entity, id, entityName) =>
          repo === seasonRepository && id === 999
            ? Promise.reject(
                new NotFoundException(`${entityName} #${id} not found`),
              )
            : Promise.resolve(),
        );
      await expect(service.create(createTournamentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if league not found', async () => {
      const createTournamentDto: CreateTournamentDto = {
        season_id: 1,
        league_id: 999,
      };
      jest
        .spyOn(seasonRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Season);
      jest.spyOn(leagueRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(
          require('../common/utils/entity-validator.util'),
          'validateEntityExists',
        )
        .mockImplementation((repo, entity, id, entityName) =>
          repo === leagueRepository && id === 999
            ? Promise.reject(
                new NotFoundException(`${entityName} #${id} not found`),
              )
            : Promise.resolve(),
        );
      await expect(service.create(createTournamentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a tournament with new season and league', async () => {
      const updateTournamentDto: UpdateTournamentDto = {
        season_id: 2,
        league_id: 2,
      };
      const updatedTournament = {
        ...mockTournament,
        season_id: 2,
        league_id: 2,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament);
      jest
        .spyOn(seasonRepository, 'findOne')
        .mockResolvedValue({ id: 2 } as Season);
      jest
        .spyOn(leagueRepository, 'findOne')
        .mockResolvedValue({ id: 2 } as League);
      jest
        .spyOn(tournamentRepository, 'preload')
        .mockResolvedValue(updatedTournament);
      jest
        .spyOn(tournamentRepository, 'save')
        .mockResolvedValue(updatedTournament);
      const result = await service.update(1, updateTournamentDto);
      expect(result).toEqual(updatedTournament);
      expect(tournamentRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateTournamentDto,
      });
      expect(tournamentRepository.save).toHaveBeenCalledWith(updatedTournament);
    });

    it('should update a tournament with existing values if DTO is empty', async () => {
      const updateTournamentDto: UpdateTournamentDto = {};
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament);
      jest
        .spyOn(seasonRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Season);
      jest
        .spyOn(leagueRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as League);
      jest
        .spyOn(tournamentRepository, 'preload')
        .mockResolvedValue(mockTournament);
      jest
        .spyOn(tournamentRepository, 'save')
        .mockResolvedValue(mockTournament);
      const result = await service.update(1, updateTournamentDto);
      expect(result).toEqual(mockTournament);
      expect(tournamentRepository.preload).toHaveBeenCalledWith({ id: 1 });
      expect(tournamentRepository.save).toHaveBeenCalledWith(mockTournament);
    });

    it('should throw NotFoundException if tournament not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if new season not found', async () => {
      const updateTournamentDto: UpdateTournamentDto = {
        season_id: 999,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament);
      jest.spyOn(seasonRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(leagueRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as League);
      jest
        .spyOn(
          require('../common/utils/entity-validator.util'),
          'validateEntityExists',
        )
        .mockImplementation((repo, entity, id, entityName) =>
          repo === seasonRepository && id === 999
            ? Promise.reject(
                new NotFoundException(`${entityName} #${id} not found`),
              )
            : Promise.resolve(),
        );
      await expect(service.update(1, updateTournamentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if new league not found', async () => {
      const updateTournamentDto: UpdateTournamentDto = {
        league_id: 999,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament);
      jest
        .spyOn(seasonRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Season);
      jest.spyOn(leagueRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(
          require('../common/utils/entity-validator.util'),
          'validateEntityExists',
        )
        .mockImplementation((repo, entity, id, entityName) =>
          repo === leagueRepository && id === 999
            ? Promise.reject(
                new NotFoundException(`${entityName} #${id} not found`),
              )
            : Promise.resolve(),
        );
      await expect(service.update(1, updateTournamentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a tournament', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTournament);
      jest
        .spyOn(tournamentRepository, 'remove')
        .mockResolvedValue(mockTournament);
      const result = await service.remove(1);
      expect(result).toEqual(mockTournament);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(tournamentRepository.remove).toHaveBeenCalledWith(mockTournament);
    });

    it('should throw NotFoundException if tournament not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('tournamentsByLeague', () => {
    it('should create and check an instance of TournamentByLeague', async () => {
      const instance = plainToClass(TournamentByLeague, mockTournamentByLeague);
      expect(instance).toBeInstanceOf(TournamentByLeague);
      expect(instance.id).toBe(1);
      expect(instance.season_id).toBe(1);
      expect(instance.league_id).toBe(1);
      expect(instance.season).toBe('2023');
      expect(instance.league).toBe('Liiga');
      expect(instance.logo).toBe('logo.png');
    });

    it('should return tournaments by league', async () => {
      jest
        .spyOn(tournamentRepository, 'query')
        .mockResolvedValue([mockTournamentByLeague]);
      const result = await service.tournamentsByLeague({ leagueId: 1 });
      expect(result).toEqual([mockTournamentByLeague]);
      expect(result[0]).toHaveProperty('id', 1);
      expect(result[0]).toHaveProperty('season_id', 1);
      expect(result[0]).toHaveProperty('league_id', 1);
      expect(result[0]).toHaveProperty('season', '2023');
      expect(result[0]).toHaveProperty('league', 'Liiga');
      expect(result[0]).toHaveProperty('logo', 'logo.png');
      expect(tournamentRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [1],
      );
    });

    it('should return an empty array if no tournaments found', async () => {
      jest.spyOn(tournamentRepository, 'query').mockResolvedValue([]);
      const result = await service.tournamentsByLeague({ leagueId: 1 });
      expect(result).toEqual([]);
      expect(tournamentRepository.query).toHaveBeenCalledWith(
        expect.any(String),
        [1],
      );
    });
  });

  describe('DTO validation', () => {
    it('should validate CreateTournamentDto', async () => {
      const createTournamentDto = {
        season_id: 1,
        league_id: 1,
      };
      const dtoInstance = plainToClass(
        CreateTournamentDto,
        createTournamentDto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('should throw BadRequestException if CreateTournamentDto is invalid', async () => {
      const createTournamentDto = {
        season_id: 'invalid',
        league_id: 1,
      };
      const dtoInstance = plainToClass(
        CreateTournamentDto,
        createTournamentDto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });

    it('should validate UpdateTournamentDto', async () => {
      const updateTournamentDto = {
        season_id: 2,
        league_id: 2,
      };
      const dtoInstance = plainToClass(
        UpdateTournamentDto,
        updateTournamentDto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('should validate UpdateTournamentDto with partial data', async () => {
      const updateTournamentDto = {
        season_id: 2,
      };
      const dtoInstance = plainToClass(
        UpdateTournamentDto,
        updateTournamentDto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBe(0);
    });

    it('should throw BadRequestException if UpdateTournamentDto is invalid', async () => {
      const updateTournamentDto = {
        season_id: 'invalid',
      };
      const dtoInstance = plainToClass(
        UpdateTournamentDto,
        updateTournamentDto,
      );
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isInt');
    });
  });
});
