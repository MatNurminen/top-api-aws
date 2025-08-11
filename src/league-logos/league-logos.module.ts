import { Module } from '@nestjs/common';
import { LeagueLogosService } from './league-logos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueLogo } from './entities/league-logo.entity';
import { LeagueLogosController } from './league-logos.controller';
import { League } from '../leagues/entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueLogo, League])],
  controllers: [LeagueLogosController],
  providers: [LeagueLogosService],
})
export class LeagueLogosModule {}
