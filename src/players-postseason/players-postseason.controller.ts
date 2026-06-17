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
import { PlayersPostseasonService } from './players-postseason.service';
import { CreatePlayerPostseasonDto } from './dto/create-player-postseason.dto';
import { UpdatePlayerPostseasonDto } from './dto/update-player-postseason.dto';

@ApiTags('Players Postseason')
@Controller('players-postseason')
export class PlayersPostseasonController {
  constructor(private readonly playersPostseasonService: PlayersPostseasonService) {}

  @Get()
  findAll() {
    return this.playersPostseasonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.playersPostseasonService.findOne(id);
  }

  @Post()
  create(@Body() createPlayerPostseasonDto: CreatePlayerPostseasonDto) {
    return this.playersPostseasonService.create(createPlayerPostseasonDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePlayerPostseasonDto: UpdatePlayerPostseasonDto,
  ) {
    return this.playersPostseasonService.update(id, updatePlayerPostseasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.playersPostseasonService.remove(id);
  }
}
