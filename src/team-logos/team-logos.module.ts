import { Module } from '@nestjs/common';
import { TeamLogosService } from './team-logos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamLogo } from './entities/team-logo.entity';
import { TeamLogosController } from './team-logos.controller';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamLogo, Team])],
  controllers: [TeamLogosController],
  providers: [TeamLogosService],
})
export class TeamLogosModule {}
