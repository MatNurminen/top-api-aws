import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamTournament } from './entities/team-tournament.entity';
import { TeamsTournamentsController } from './teams-tournaments.controller';
import { TeamsTournamentsService } from './teams-tournaments.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamTournament])],
  controllers: [TeamsTournamentsController],
  providers: [TeamsTournamentsService],
})
export class TeamsTournamentsModule {}
