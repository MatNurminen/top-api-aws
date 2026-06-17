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
import { TeamsPostseasonService } from './teams-postseason.service';
import { CreateTeamPostseasonDto } from './dto/create-team-postseason.dto';
import { UpdateTeamPostseasonDto } from './dto/update-team-postseason.dto';

@ApiTags('Teams Postseason')
@Controller('teams-postseason')
export class TeamsPostseasonController {
  constructor(
    private readonly teamsPostseasonService: TeamsPostseasonService,
  ) {}

  @Get()
  findAll() {
    return this.teamsPostseasonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamsPostseasonService.findOne(id);
  }

  @Post()
  create(@Body() createTeamPostseasonDto: CreateTeamPostseasonDto) {
    return this.teamsPostseasonService.create(createTeamPostseasonDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTeamPostseasonDto: UpdateTeamPostseasonDto,
  ) {
    return this.teamsPostseasonService.update(id, updateTeamPostseasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teamsPostseasonService.remove(id);
  }
}
