import { Test, TestingModule } from '@nestjs/testing';
import { Standing } from './entities/standing.entity';
import { TeamsStatsController } from './teams-stats.controller';
import { TeamsStatsService } from './teams-stats.service';

describe('TeamsStatsController', () => {
  let controller: TeamsStatsController;
  let service: TeamsStatsService;

  const mockStanding: Standing = {
    id: 62,
    tournament_id: 9,
    team_id: 65,
    games: 20,
    wins: 40,
    ties: 39,
    losts: 11,
    goals_for: 13,
    goals_against: 31,
    postseason: null,
    gd: -18,
    pts: 119,
    full_name: 'HC Ambri-Piotta',
    season_id: 2012,
    name: 'National League',
    season: '2012-13',
    logo: '/img/nla/ambri.png',
  };

  const mockTeamsStatsService = {
    standings: jest.fn().mockResolvedValue([mockStanding]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsStatsController],
      providers: [
        {
          provide: TeamsStatsService,
          useValue: mockTeamsStatsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsStatsController>(TeamsStatsController);
    service = module.get<TeamsStatsService>(TeamsStatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of teaams standings', async () => {
    expect(await controller.getStandings(9, 2012)).toEqual([mockStanding]);
    expect(service.standings).toHaveBeenCalledWith({
      leagueId: 9,
      seasonId: 2012,
    });
  });
});
