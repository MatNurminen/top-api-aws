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
import { SeasonsService } from './seasons.service';
import { CreateSeasonDto } from './dto/create-season.dto';
import { Season } from './entities/season.entity';
import { UpdateSeasonDto } from './dto/update-season.dto';

@ApiTags('Seasons')
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  findAll(): Promise<Season[]> {
    return this.seasonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Season> {
    return this.seasonsService.findOne(id);
  }

  @Post()
  create(@Body() createSeasonDto: CreateSeasonDto): Promise<Season> {
    return this.seasonsService.create(createSeasonDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateSeasonDto: UpdateSeasonDto,
  ): Promise<Season> {
    return this.seasonsService.update(id, updateSeasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Season> {
    return this.seasonsService.remove(id);
  }
}
