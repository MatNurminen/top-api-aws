import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamsTournamentsService } from './teams-tournaments.service';
import { TeamTournament } from './entities/team-tournament.entity';
import { CreateTeamTournamentDto } from './dto/create-team-tournament.dto';
import { UpdateTeamTournamentDto } from './dto/update-team-tournament.dto';
import { TeamsByTournament } from './entities/teamsByTournament.entity';

@ApiTags('TeamsTournaments')
@Controller('teams-tournaments')
export class TeamsTournamentsController {
  constructor(
    private readonly teamsTournamentsService: TeamsTournamentsService,
  ) {}

  @Get()
  findAll(): Promise<TeamTournament[]> {
    return this.teamsTournamentsService.findAll();
  }

  @Get('teams')
  getTeamsByLeague(
    @Query('tournamentId') tournamentId: number,
  ): Promise<TeamsByTournament[]> {
    return this.teamsTournamentsService.teamsByTournament({ tournamentId });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<TeamTournament> {
    return this.teamsTournamentsService.findOne(id);
  }

  @Post()
  create(
    @Body() createTournamentDto: CreateTeamTournamentDto,
  ): Promise<TeamTournament> {
    return this.teamsTournamentsService.create(createTournamentDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentDto: UpdateTeamTournamentDto,
  ): Promise<TeamTournament> {
    return this.teamsTournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<TeamTournament> {
    return this.teamsTournamentsService.remove(id);
  }
}
