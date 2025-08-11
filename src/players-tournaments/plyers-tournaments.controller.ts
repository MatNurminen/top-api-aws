import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayersTournamentsService } from './players-tournaments.service';
import { PlayerTournament } from './entities/player-tournament.entity';
import { CreatePlayerTournamentDto } from './dto/create-player-tournament.dto';
import { UpdatePlayerTournamentDto } from './dto/update-player-tournament.dto';

@ApiTags('PlayersTournaments')
@Controller('players-tournaments')
export class PlayersTournamentsController {
  constructor(
    private readonly playersTournamentsService: PlayersTournamentsService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PlayerTournament> {
    return this.playersTournamentsService.findOne(id);
  }

  @Post()
  create(
    @Body() createPlayerTournamentDto: CreatePlayerTournamentDto,
  ): Promise<PlayerTournament> {
    return this.playersTournamentsService.create(createPlayerTournamentDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePlayerTournamentDto: UpdatePlayerTournamentDto,
  ): Promise<PlayerTournament> {
    return this.playersTournamentsService.update(id, updatePlayerTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<PlayerTournament> {
    return this.playersTournamentsService.remove(id);
  }
}
