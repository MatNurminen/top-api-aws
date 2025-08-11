import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LeagueLogosService } from './league-logos.service';
import { CreateLeagueLogoDto } from './dto/create-league-logo.dto';
import { UpdateLeagueLogoDto } from './dto/update-league-logo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('League Logos')
@Controller('league-logos')
export class LeagueLogosController {
  constructor(private readonly leagueLogosService: LeagueLogosService) {}

  @Get()
  findAll() {
    return this.leagueLogosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.leagueLogosService.findOne(id);
  }

  @Post()
  create(@Body() createLeagueLogoDto: CreateLeagueLogoDto) {
    return this.leagueLogosService.create(createLeagueLogoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateLeagueLogoDto: UpdateLeagueLogoDto,
  ) {
    return this.leagueLogosService.update(id, updateLeagueLogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.leagueLogosService.remove(id);
  }
}
