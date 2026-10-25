import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamLogo } from '../team-logos/entities/team-logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamLogo])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
