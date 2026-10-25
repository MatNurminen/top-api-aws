import { Module } from '@nestjs/common';
import { TeamsStatsController } from './teams-stats.controller';
import { TeamsStatsService } from './teams-stats.service';

@Module({
  controllers: [TeamsStatsController],
  providers: [TeamsStatsService],
})
export class TeamsStatsModule {}
