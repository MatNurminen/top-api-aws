import { Module } from '@nestjs/common';
import { Standing } from './entities/standing.entity';
import { TeamsStatsController } from './teams-stats.controller';
import { TeamsStatsService } from './teams-stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamForNation } from './entities/teamsForNation.entity';
import { TeamFact } from './entities/teamsFacts';

@Module({
  imports: [TypeOrmModule.forFeature([Standing, TeamForNation, TeamFact])],
  controllers: [TeamsStatsController],
  providers: [TeamsStatsService],
})
export class TeamsStatsModule {}
