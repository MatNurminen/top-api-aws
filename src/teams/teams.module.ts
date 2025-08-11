import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Nation } from '../nations/entities/nation.entity';
import { TeamByLeague } from './entities/teamByLeague.entity';
import { TeamLogo } from '../team-logos/entities/team-logo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamLogo, TeamByLeague, Nation])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
