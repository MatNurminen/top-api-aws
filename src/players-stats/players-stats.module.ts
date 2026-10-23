import { Module } from '@nestjs/common';
import { PlayersStatsService } from './players-stats.service';
import { PlayersStatsController } from './players-stats.controller';

@Module({
  controllers: [PlayersStatsController],
  providers: [PlayersStatsService],
})
export class PlayersStatsModule {}
