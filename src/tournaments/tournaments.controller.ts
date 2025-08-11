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
import { TournamentsService } from './tournaments.service';
import { Tournament } from './entities/tournament.entity';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentByLeague } from './entities/tournamentByLeague.entity';

@ApiTags('Tournaments')
@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll(): Promise<Tournament[]> {
    return this.tournamentsService.findAll();
  }

  @Get('league')
  getTournamentsByLeague(
    @Query('leagueId') leagueId: number,
  ): Promise<TournamentByLeague[]> {
    return this.tournamentsService.tournamentsByLeague({ leagueId });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Tournament> {
    return this.tournamentsService.findOne(id);
  }

  @Post()
  create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<Tournament> {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Tournament> {
    return this.tournamentsService.remove(id);
  }
}
