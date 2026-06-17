import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerPostseason } from './entities/player-postseason.entity';
import { PlayerTournament } from '../players-tournaments/entities/player-tournament.entity';
import { PlayersPostseasonController } from './players-postseason.controller';
import { PlayersPostseasonService } from './players-postseason.service';


@Module({
  imports: [TypeOrmModule.forFeature([PlayerPostseason, PlayerTournament])],
  controllers: [PlayersPostseasonController],
  providers: [PlayersPostseasonService],
})
export class PlayersPostseasonModule {}
