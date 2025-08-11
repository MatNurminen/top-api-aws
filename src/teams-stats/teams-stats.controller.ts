import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamsStatsService } from './teams-stats.service';
import { Standing } from './entities/standing.entity';
import { TeamsForNationDto } from './params-dto/teams-for-nation.dto';
import { TeamForNation } from './entities/teamsForNation.entity';
import { TeamFact } from './entities/teamsFacts';
import { TeamsStandingDto } from './params-dto/teams-standing.dto';

@ApiTags('Teams Stats')
@Controller('teams-stats')
export class TeamsStatsController {
  constructor(private readonly teamsStatsService: TeamsStatsService) {}

  @Get('standings')
  async getStandings(@Query() query: TeamsStandingDto): Promise<Standing[]> {
    return this.teamsStatsService.standings(query);
  }

  @Get('teams')
  async getPlayersTotalStats(
    @Query() query: TeamsForNationDto,
  ): Promise<TeamForNation[]> {
    return this.teamsStatsService.teamsForNation(query);
  }

  @Get('facts')
  getTeamsFacts(
    @Query('leagueId') leagueId: number,
    @Query('seasonId') seasonId: number,
  ): Promise<TeamFact[]> {
    return this.teamsStatsService.teamFacts({ leagueId, seasonId });
  }
}
