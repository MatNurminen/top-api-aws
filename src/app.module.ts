import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaguesModule } from './leagues/leagues.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueLogosModule } from './league-logos/league-logos.module';
import { configService } from './config/config.service';
import { NationsModule } from './nations/nations.module';
import { TeamsModule } from './teams/teams.module';
import { TeamLogosModule } from './team-logos/team-logos.module';
import { SeasonsModule } from './seasons/seasons.module';
import { PlayersModule } from './players/players.module';
import { TeamsStatsModule } from './teams-stats/teams-stats.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { TeamsTournamentsModule } from './teams-tournaments/teams-tournaments.module';
import { PlayersStatsModule } from './players-stats/players-stats.module';
import { UploadModule } from './cloudinary/upload.module';
import { LeagueTypesModule } from './league_types/league-types.module';
import { UploadCFModule } from './cloudflare/cloudflare.module';
import { PlayersTournamentsModule } from './players-tournaments/players-tournaments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    LeaguesModule,
    LeagueLogosModule,
    LeagueTypesModule,
    NationsModule,
    TeamsModule,
    TeamLogosModule,
    SeasonsModule,
    PlayersModule,
    TeamsStatsModule,
    TournamentsModule,
    TeamsTournamentsModule,
    PlayersStatsModule,
    UploadModule,
    UploadCFModule,
    PlayersTournamentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
