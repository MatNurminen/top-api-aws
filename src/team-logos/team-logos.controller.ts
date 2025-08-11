import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TeamLogosService } from './team-logos.service';
import { CreateTeamLogoDto } from './dto/create-team-logo.dto';
import { UpdateTeamLogoDto } from './dto/update-team-logo.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Team Logos')
@Controller('team-logos')
export class TeamLogosController {
  constructor(private readonly teamLogosService: TeamLogosService) {}

  @Get()
  findAll() {
    return this.teamLogosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamLogosService.findOne(id);
  }

  @Post()
  create(@Body() createTeamLogoDto: CreateTeamLogoDto) {
    return this.teamLogosService.create(createTeamLogoDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTeamLogoDto: UpdateTeamLogoDto,
  ) {
    return this.teamLogosService.update(id, updateTeamLogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teamLogosService.remove(id);
  }
}
