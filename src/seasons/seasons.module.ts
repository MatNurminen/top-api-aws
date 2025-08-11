import { Module } from '@nestjs/common';
import { SeasonsService } from './seasons.service';
import { SeasonsController } from './seasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Season } from './entities/season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Season])],
  controllers: [SeasonsController],
  providers: [SeasonsService],
})
export class SeasonsModule {}
