import { Test, TestingModule } from '@nestjs/testing';
import { LeagueLogosController } from './league-logos.controller';
import { LeagueLogosService } from './league-logos.service';
import { LeagueLogo } from './entities/league-logo.entity';

describe('LeagueLogosController', () => {
  let controller: LeagueLogosController;
  let service: LeagueLogosService;

  const mockLeagueLogo: LeagueLogo = {
    id: 2,
    start_year: 2012,
    end_year: null,
    logo: '/img/liiga/logo.png',
    league_id: 2,
    league: {
      id: 1,
      name: 'Test League',
      short_name: 'LAGGH',
      color: '#CD5C5C',
      start_year: 2012,
    },
  };

  const mockLeagueLogosService = {
    findAll: jest.fn().mockResolvedValue([mockLeagueLogo]),
    findOne: jest.fn().mockResolvedValue(mockLeagueLogo),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueLogosController],
      providers: [
        {
          provide: LeagueLogosService,
          useValue: mockLeagueLogosService,
        },
      ],
    }).compile();

    controller = module.get<LeagueLogosController>(LeagueLogosController);
    service = module.get<LeagueLogosService>(LeagueLogosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of league logos', async () => {
    expect(await controller.findAll()).toEqual([mockLeagueLogo]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a league by ID', async () => {
    expect(await controller.findOne(1)).toEqual(mockLeagueLogo);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });
});
