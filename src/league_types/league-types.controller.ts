import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeagueTypesService } from './league-types.service';

@ApiTags('League Types')
@Controller('league-types')
export class LeagueTypesController {
  constructor(private readonly leagueTypesService: LeagueTypesService) {}

  @Get()
  findAll() {
    return this.leagueTypesService.findAll();
  }
}
