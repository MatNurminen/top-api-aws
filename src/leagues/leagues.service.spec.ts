import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesService } from './leagues.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LeagueLogo } from '../league-logos/entities/league-logo.entity';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';

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
});
