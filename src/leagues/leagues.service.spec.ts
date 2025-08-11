import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeagueLogo } from '../league-logos/entities/league-logo.entity';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('LeaguesService', () => {
  let leaguesService: LeaguesService;
  let leaguesRepository: MockRepository;

  const expectedLeague = {};
  const leagueId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesService,
        {
          provide: getRepositoryToken(LeagueLogo),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(League),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    leaguesService = module.get<LeaguesService>(LeaguesService);
    leaguesRepository = module.get<MockRepository>(getRepositoryToken(League));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(leaguesService).toBeDefined();
  });

  // describe('findAll', () => {
  //   describe('when get all leagues', () => {
  //     it('should return the leagues array objects', () => {
  //       const expectedLeagues = [{}];
  //       leaguesRepository.find.mockReturnValue(expectedLeagues);
  //       const leagues = leaguesService.findAll();
  //       expect(leagues).toEqual(expectedLeagues);
  //     });
  //   });
  // });

  // describe('findOne', () => {
  //   describe('when league with ID exists', () => {
  //     it('should return the league object', async () => {
  //       leaguesRepository.findOne.mockReturnValue(expectedLeague);
  //       const league = await leaguesService.findOne(leagueId);
  //       expect(league).toEqual(expectedLeague);
  //     });
  //   });
  //   describe('otherwise', () => {
  //     it('sould throw the "NotFoundException"', async () => {
  //       leaguesRepository.findOne.mockReturnValue(undefined);
  //       try {
  //         await leaguesService.findOne(leagueId);
  //       } catch (err) {
  //         expect(err).toBeInstanceOf(NotFoundException);
  //         expect(err.message).toEqual(`League #${leagueId} not found`);
  //       }
  //     });
  //   });
  // });

  // // describe('create', () => {
  //   it('should create a new league and return it', async () => {
  //     const createLeagueDto = {
  //       name: 'Test League',
  //       color: '#ffffff',
  //       short_name: 'TLG',
  //       start_year: 2012,
  //     };
  //     const expectedLeague = { id: 1, ...createLeagueDto };

  //     leaguesRepository.save.mockReturnValue(expectedLeague);
  //     const result = await leaguesService.create(createLeagueDto);

  //     expect(leaguesRepository.create).toHaveBeenCalledWith(createLeagueDto);
  //     expect(result).toEqual(expectedLeague);
  //   });
  // });
});
