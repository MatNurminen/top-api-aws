import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { Season } from '../seasons/entities/season.entity';
import { League } from '../leagues/entities/league.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament, Season, League])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}
