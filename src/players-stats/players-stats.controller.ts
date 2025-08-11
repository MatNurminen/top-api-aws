import { Controller, Get, Query } from '@nestjs/common';
import { PlayersStatsService } from './players-stats.service';
import { PlayersStatsTotalParamsDto } from './params-dto/players-stats-total.dto';
import {
  CountPlayerByNation,
  PlayerStatDetail,
  PlayerStatLeague,
  PlayerStatTeam,
  PlayerStatTotal,
} from './entities/players-stats.entity';
import { ApiTags } from '@nestjs/swagger';
import { PlayersStatsDetailParamsDto } from './params-dto/players-stats-detail.dto';
import { CountPlayersByNationParamsDto } from './params-dto/count-players-by-nation.dto';

@ApiTags('Players Stats')
@Controller('players-stats')
export class PlayersStatsController {
  constructor(private readonly playersStatsService: PlayersStatsService) {}

  @Get('total')
  async getPlayersTotalStats(
    @Query() query: PlayersStatsTotalParamsDto,
  ): Promise<PlayerStatTotal[]> {
    return this.playersStatsService.playersStatsTotal(query);
  }

  @Get('detail')
  async getPlayersDetailStats(
    @Query() query: PlayersStatsDetailParamsDto,
  ): Promise<PlayerStatDetail[]> {
    return this.playersStatsService.playersStatsDetails(query);
  }

  @Get('count-by-nation')
  async getCountPlayersByNation(
    @Query() query: CountPlayersByNationParamsDto,
  ): Promise<CountPlayerByNation[]> {
    return this.playersStatsService.countPlayersByNation(query);
  }

  @Get('league')
  async getPlayersStatsLeagues(
    @Query('playerId') playerId: number,
  ): Promise<PlayerStatLeague[]> {
    return this.playersStatsService.playersStatsLeagues({ playerId });
  }

  @Get('team')
  async getPlayersStatsTeams(
    @Query('playerId') playerId: number,
  ): Promise<PlayerStatTeam[]> {
    return this.playersStatsService.playersStatsTeams({ playerId });
  }
}
