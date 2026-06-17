import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPostseason } from './entities/teams-postseason.entity';
import { TeamTournament } from '../teams-tournaments/entities/team-tournament.entity';
import { TeamsPostseasonController } from './teams-postseason.controller';
import { TeamsPostseasonService } from './teams-postseason.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamPostseason, TeamTournament])],
  controllers: [TeamsPostseasonController],
  providers: [TeamsPostseasonService],
})
export class TeamsPostseasonModule {}
