import { Module } from '@nestjs/common';
import { NationsService } from './nations.service';
import { NationsController } from './nations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nation } from './entities/nation.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nation, Team])],
  controllers: [NationsController],
  providers: [NationsService],
})
export class NationsModule {}
