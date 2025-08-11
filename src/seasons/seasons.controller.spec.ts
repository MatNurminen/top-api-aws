import { Test, TestingModule } from '@nestjs/testing';
import { SeasonsController } from './seasons.controller';
import { SeasonsService } from './seasons.service';
import { Season } from './entities/season.entity';
import { CreateSeasonDto } from './dto/create-season.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';

describe('LeaguesController', () => {
  let controller: SeasonsController;
  let service: SeasonsService;

  const mockSeason: Season = {
    id: 2024,
    name: '2024-25',
    logo: '/img/test.jpg',
    link: '/rosters?league=14&year=2024',
  };

  const mockCreateSeason = {
    id: 2010,
    name: '2010-11',
    logo: '/img/test10.jpg',
    link: '/rosters?league=14&year=2010',
  };

  const mockSeasonsService = {
    findAll: jest.fn().mockResolvedValue([mockSeason]),
    findOne: jest.fn().mockResolvedValue(mockSeason),
    create: jest.fn().mockResolvedValue(mockSeason),
    update: jest.fn().mockResolvedValue(mockSeason),
    remove: jest.fn().mockResolvedValue(mockSeason),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasonsController],
      providers: [
        {
          provide: SeasonsService,
          useValue: mockSeasonsService,
        },
      ],
    }).compile();

    controller = module.get<SeasonsController>(SeasonsController);
    service = module.get<SeasonsService>(SeasonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of seasons', async () => {
      expect(await controller.findAll()).toEqual([mockSeason]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a season by ID', async () => {
      expect(await controller.findOne(1)).toEqual(mockSeason);
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

  it('should create a new season', async () => {
    const createSeasonDto: CreateSeasonDto = mockCreateSeason;
    expect(await controller.create(createSeasonDto)).toEqual(mockSeason);
    expect(service.create).toHaveBeenCalledWith(createSeasonDto);
  });

  it('should update a season', async () => {
    const updateSeasonDto: UpdateSeasonDto = { logo: '/img/testNew.jpg' };
    expect(await controller.update(1, updateSeasonDto)).toEqual(mockSeason);
    expect(service.update).toHaveBeenCalledWith(1, updateSeasonDto);
  });

  it('should delete a season', async () => {
    expect(await controller.remove(1)).toEqual(mockSeason);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
