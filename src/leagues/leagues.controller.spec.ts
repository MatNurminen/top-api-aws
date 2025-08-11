import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { League } from './entities/league.entity';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

describe('LeaguesController', () => {
  let controller: LeaguesController;
  let service: LeaguesService;

  const mockLeague: League = {
    id: 1,
    name: 'Test League',
    short_name: 'LAGGH',
    color: '#CD5C5C',
    start_year: 2012,
    type_id: 1,
  };

  const mockCreateLeague = {
    name: 'Test League',
    color: '#ffffff',
    short_name: 'TLG',
    start_year: 2012,
    type_id: 1,
  };

  const mockLeaguesService = {
    findAll: jest.fn().mockResolvedValue([mockLeague]),
    findOne: jest.fn().mockResolvedValue(mockLeague),
    create: jest.fn().mockResolvedValue(mockLeague),
    update: jest.fn().mockResolvedValue(mockLeague),
    remove: jest.fn().mockResolvedValue(mockLeague),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaguesController],
      providers: [
        {
          provide: LeaguesService,
          useValue: mockLeaguesService,
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
    service = module.get<LeaguesService>(LeaguesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of leagues', async () => {
      expect(await controller.findAll()).toEqual([mockLeague]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a league by ID', async () => {
      expect(await controller.findOne(1)).toEqual(mockLeague);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    // it('should throw NotFoundException', async () => {
    //   try {
    //     await service.findOne(1000);
    //   } catch (error: any) {
    //     expect(error.message).toEqual('Not Found');
    //     //expect(error.status).toEqual('League #1000 not found');
    //     expect(error.name).toEqual('NotFoundException');
    //   }
    // });
  });

  it('should create a new league', async () => {
    const createLeagueDto: CreateLeagueDto = mockCreateLeague;
    expect(await controller.create(createLeagueDto)).toEqual(mockLeague);
    expect(service.create).toHaveBeenCalledWith(createLeagueDto);
  });

  it('should update a league', async () => {
    const updateLeagueDto: UpdateLeagueDto = { name: 'Updated League' };
    expect(await controller.update(1, updateLeagueDto)).toEqual(mockLeague);
    expect(service.update).toHaveBeenCalledWith(1, updateLeagueDto);
  });

  it('should delete a league', async () => {
    expect(await controller.remove(1)).toEqual(mockLeague);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
