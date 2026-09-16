import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from '../leagues/entities/league.entity';
import { PlayersTournamentsAward } from './entities/players-tournaments-award.entity';
import { Award } from '../awards/entities/award.entity';
import { PlayerTournament } from '../players-tournaments/entities/player-tournament.entity';
import { PlayersTournamentsAwardsController } from './players-tournaments-awards.controller';
import { PlayersTournamentsAwardsService } from './players-tournaments-awards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayersTournamentsAward,
      Award,
      PlayerTournament,
    ]),
  ],
  controllers: [PlayersTournamentsAwardsController],
  providers: [PlayersTournamentsAwardsService],
})
export class PlayersTournamentsAwardsModule {}
