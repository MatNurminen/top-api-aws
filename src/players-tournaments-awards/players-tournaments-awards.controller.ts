import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayersTournamentsAwardsService } from './players-tournaments-awards.service';
import { PlayersTournamentsAward } from './entities/players-tournaments-award.entity';

@ApiTags('PlayersTournamentsAwards')
@Controller('players-tournaments-awards')
export class PlayersTournamentsAwardsController {
  constructor(private readonly playersTournamentsAwardsService: PlayersTournamentsAwardsService) {}

  @Get()
  findAll(): Promise<PlayersTournamentsAward[]> {
    return this.playersTournamentsAwardsService.findAll();
  }
}
