import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeam: Team = {
    id: 1,
    full_name: 'Test Team',
    name: 'Team',
    short_name: 'TEM',
    start_year: 2012,
    nation_id: 4,
    nation: {
      id: 4,
      name: 'Canada',
      short_name: 'CAN',
      flag: 'dcevfevfe',
    },
  };

  const mockCreateTeam = {
    full_name: 'Test Team',
    name: 'Team',
    short_name: 'TEM',
    start_year: 2012,
    nation_id: 4,
  };

  const mockTeamsByLeague = {
    id: 27,
    nation_id: 15,
    full_name: 'Brynas IF',
    flag: '/img/flags/swe.svg',
    logo: '/img/shl/brynas.png',
  };

  const mockTeamsService = {
    findAll: jest.fn().mockResolvedValue([mockTeam]),
    teamsByLeague: jest.fn().mockResolvedValue([mockTeamsByLeague]),
    findOne: jest.fn().mockResolvedValue(mockTeam),
    create: jest.fn().mockResolvedValue(mockTeam),
    update: jest.fn().mockResolvedValue(mockTeam),
    remove: jest.fn().mockResolvedValue(mockTeam),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of teams', async () => {
    expect(await controller.findAll()).toEqual([mockTeam]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return teams by league', async () => {
    await expect(controller.getTeamsByLeague(3)).resolves.toEqual([
      mockTeamsByLeague,
    ]);
    expect(service.teamsByLeague).toHaveBeenCalledWith({ leagueId: 3 });
  });

  it('should return a team by ID', async () => {
    expect(await controller.findOne(1)).toEqual(mockTeam);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a new team', async () => {
    const createTeamDto: CreateTeamDto = mockCreateTeam;
    expect(await controller.create(createTeamDto)).toEqual(mockTeam);
    expect(service.create).toHaveBeenCalledWith(createTeamDto);
  });

  it('should update a team', async () => {
    const updateTeamDto: UpdateTeamDto = { name: 'Updated Team' };
    expect(await controller.update(1, updateTeamDto)).toEqual(mockTeam);
    expect(service.update).toHaveBeenCalledWith(1, updateTeamDto);
  });

  it('should delete a team', async () => {
    expect(await controller.remove(1)).toEqual(mockTeam);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
