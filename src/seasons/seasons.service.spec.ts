import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsService } from './seasons.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('SeasonsService', () => {
  let seasonsService: SeasonsService;
  let seasonsRepository: MockRepository;

  const expectedSeason = {};
  const seasonId = 2023;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        {
          provide: getRepositoryToken(Season),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    seasonsService = module.get<SeasonsService>(SeasonsService);
    seasonsRepository = module.get<MockRepository>(getRepositoryToken(Season));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seasonsService).toBeDefined();
  });

  describe('findAll', () => {
    describe('when get all seasons', () => {
      it('should return the seasons array objects', () => {
        const expectedSeasons = [{}];
        seasonsRepository.find.mockReturnValue(expectedSeasons);
        const seasons = seasonsService.findAll();
        expect(seasons).toEqual(expectedSeasons);
      });
    });
  });

  describe('findOne', () => {
    describe('when season with ID exists', () => {
      it('should return the season object', async () => {
        seasonsRepository.findOne.mockReturnValue(expectedSeason);
        const season = await seasonsService.findOne(seasonId);
        expect(season).toEqual(expectedSeason);
      });
    });
    describe('otherwise', () => {
      it('sould throw the "NotFoundException"', async () => {
        seasonsRepository.findOne.mockReturnValue(undefined);
        try {
          await seasonsService.findOne(seasonId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Season #${seasonId} not found`);
        }
      });
    });
  });

  describe('create', () => {
    it('should create a new season and return it', async () => {
      const createSeasonDto = {
        id: 1983,
        name: '1983-84',
        logo: 'test.jpg',
        link: 'img/test.jpg',
      };
      const expectedSeason = { id: 1, ...createSeasonDto };

      seasonsRepository.save.mockReturnValue(expectedSeason);
      const result = await seasonsService.create(createSeasonDto);

      expect(seasonsRepository.create).toHaveBeenCalledWith(createSeasonDto);
      expect(result).toEqual(expectedSeason);
    });
  });
});
