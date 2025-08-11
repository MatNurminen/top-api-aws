import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NationsService } from './nations.service';
import { CreateNationDto } from './dto/create-nation.dto';
import { Nation } from './entities/nation.entity';
import { UpdateNationDto } from './dto/update-nation.dto';

@ApiTags('Nations')
@Controller('nations')
export class NationsController {
  constructor(private readonly nationsService: NationsService) {}

  @Get()
  findAll(): Promise<Nation[]> {
    return this.nationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Nation> {
    return this.nationsService.findOne(id);
  }

  @Post()
  create(@Body() createNationDto: CreateNationDto): Promise<Nation> {
    return this.nationsService.create(createNationDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNationDto: UpdateNationDto,
  ): Promise<Nation> {
    return this.nationsService.update(id, updateNationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Nation> {
    return this.nationsService.remove(id);
  }
}
