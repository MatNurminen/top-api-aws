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
import { ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { TeamByLeague } from './entities/teamByLeague.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@Query('filter') filter?: string): Promise<Team[]> {
    return this.teamsService.findAll(filter);
  }

  @Get('league')
  getTeamsByLeague(
    @Query('leagueId') leagueId: number,
  ): Promise<TeamByLeague[]> {
    return this.teamsService.teamsByLeague({ leagueId });
  }

  @Get('/nation/:nationId')
  async countByNationId(@Param('nationId') nationId: number): Promise<number> {
    return this.teamsService.countByNationId(nationId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    const newTeam = await this.teamsService.create(createTeamDto);
    return newTeam;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    const updatedTeam = await this.teamsService.update(id, updateTeamDto);
    return updatedTeam;
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Team> {
    return this.teamsService.remove(id);
  }
}
