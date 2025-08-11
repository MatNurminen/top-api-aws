import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueType } from './entities/league-type.entity';
import { LeagueTypesController } from './league-types.controller';
import { LeagueTypesService } from './league-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueType])],
  controllers: [LeagueTypesController],
  providers: [LeagueTypesService],
})
export class LeagueTypesModule {}
