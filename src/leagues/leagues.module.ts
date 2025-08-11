import { Module } from '@nestjs/common';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { League } from './entities/league.entity';
import { LeagueLogo } from '../league-logos/entities/league-logo.entity';
import { LeagueByNation } from './entities/leagueByNation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([League, LeagueLogo, LeagueByNation])],
  controllers: [LeaguesController],
  providers: [LeaguesService],
})
export class LeaguesModule {}
