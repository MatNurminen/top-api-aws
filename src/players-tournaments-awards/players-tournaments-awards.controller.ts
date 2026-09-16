import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayersTournamentsAwardsService } from './players-tournaments-awards.service';
import { PlayersTournamentsAward } from './entities/players-tournaments-award.entity';
import { CreatePlayersTournamentsAwardDto } from './dto/create-players-tournaments-award.dto';

@ApiTags('PlayersTournamentsAwards')
@Controller('players-tournaments-awards')
export class PlayersTournamentsAwardsController {
  constructor(
    private readonly playersTournamentsAwardsService: PlayersTournamentsAwardsService,
  ) {}

  @Get()
  findAll(): Promise<PlayersTournamentsAward[]> {
    return this.playersTournamentsAwardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PlayersTournamentsAward> {
    return this.playersTournamentsAwardsService.findOne(id);
  }

  @Post()
  create(
    @Body() createPlayersTournamentsAwardDto: CreatePlayersTournamentsAwardDto,
  ): Promise<PlayersTournamentsAward> {
    return this.playersTournamentsAwardsService.create(
      createPlayersTournamentsAwardDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<PlayersTournamentsAward> {
    return this.playersTournamentsAwardsService.remove(id);
  }
}
