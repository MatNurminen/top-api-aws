import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postseason } from './entities/postseason.entity';
import { TeamTournament } from '../teams-tournaments/entities/team-tournament.entity';
import { PostseasonsController } from './postseasons.controller';
import { PostseasonsService } from './postseasons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Postseason, TeamTournament])],
  controllers: [PostseasonsController],
  providers: [PostseasonsService],
})
export class PostseasonsModule {}
