import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { FreeAgent } from './entities/free-agent.entity';
import {
  DraftDetail,
  DraftNation,
  DraftTeam,
} from './entities/drat-player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      FreeAgent,
      DraftNation,
      DraftTeam,
      DraftDetail,
    ]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
