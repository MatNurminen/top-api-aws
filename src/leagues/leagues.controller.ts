import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { ApiTags } from '@nestjs/swagger';
import { League } from './entities/league.entity';
import { LeagueByNation } from './entities/leagueByNation.entity';

@ApiTags('Leagues')
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  findAll(): Promise<League[]> {
    return this.leaguesService.findAll();
  }

  @Get('logo')
  findAllWithCurLogo(): Promise<League[]> {
    return this.leaguesService.findAllWithCurLogo();
  }

  @Get('nation')
  getLeaguesByNation(
    @Query('nationId') nationId: number,
  ): Promise<LeagueByNation[]> {
    return this.leaguesService.leaguesByNation({ nationId });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<League> {
    return this.leaguesService.findOne(id);
  }

  @Post()
  async create(@Body() createLeagueDto: CreateLeagueDto): Promise<League> {
    const newLeague = await this.leaguesService.create(createLeagueDto);
    return newLeague;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<League> {
    const updatedLeague = await this.leaguesService.update(id, updateLeagueDto);
    return updatedLeague;
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<League> {
    return this.leaguesService.remove(id);
  }
}
