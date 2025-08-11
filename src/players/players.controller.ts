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
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Player } from './entities/player.entity';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { FreeAgent } from './entities/free-agent.entity';
import {
  DraftDetail,
  DraftNation,
  DraftTeam,
} from './entities/drat-player.entity';
import { DraftDetailParamsDto } from './params-dto/draft-detail.dto';

@ApiTags('Players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query('filter') filter?: string): Promise<Player[]> {
    return this.playersService.findAll(filter);
  }

  @Get('/nation/:nationId')
  async countByNationId(@Param('nationId') nationId: number): Promise<number> {
    return this.playersService.countByNationId(nationId);
  }

  @Get('free-agents')
  getTeamsFacts(
    @Query('seasonId') seasonId: number,
    @Query('nationId') nationId: number,
  ): Promise<FreeAgent[]> {
    return this.playersService.freeAgents({ seasonId, nationId });
  }

  @Get('/draft/nations')
  getDraftNations(): Promise<DraftNation[]> {
    return this.playersService.draftNations();
  }

  @Get('/draft/teams')
  getDraftTeams(): Promise<DraftTeam[]> {
    return this.playersService.draftTeams();
  }

  @Get('/draft/details')
  async getDraftDetails(
    @Query() query: DraftDetailParamsDto,
  ): Promise<DraftDetail[]> {
    return this.playersService.draftDetails(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Player> {
    return this.playersService.remove(id);
  }
}
