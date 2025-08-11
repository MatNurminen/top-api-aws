import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersTournamentsController } from './plyers-tournaments.controller';
import { PlayersTournamentsService } from './players-tournaments.service';
import { PlayerTournament } from './entities/player-tournament.entity';
import { TeamTournament } from '../teams-tournaments/entities/team-tournament.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlayerTournament, TeamTournament, Player]),
  ],
  controllers: [PlayersTournamentsController],
  providers: [PlayersTournamentsService],
})
export class PlayersTournamentsModule {}
