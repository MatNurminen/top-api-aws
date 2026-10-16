import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Award } from './entities/award.entity';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { League } from '../leagues/entities/league.entity';
import {
  AwardStatsDetails,
  AwardStatsTotals,
} from './entities/awardStats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Award,
      League,
      AwardStatsDetails,
      AwardStatsTotals,
    ]),
  ],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsModule {}
