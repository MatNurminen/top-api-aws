import { Module } from '@nestjs/common';
import { PlayersStatsService } from './players-stats.service';
import {
  CountPlayerByNation,
  PlayerStatDetail,
  PlayerStatLeague,
  PlayerStatTeam,
  PlayerStatTotal,
  PlayerStatTotalByClub,
} from './entities/players-stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersStatsController } from './players-stats.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerStatTotal,
      PlayerStatTotalByClub,
      PlayerStatDetail,
      CountPlayerByNation,
      PlayerStatLeague,
      PlayerStatTeam,
    ]),
  ],
  controllers: [PlayersStatsController],
  providers: [PlayersStatsService],
})
export class PlayersStatsModule {}
