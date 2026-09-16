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
import { AwardsService } from './awards.service';
import { Award } from './entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award-logo.dto';

@ApiTags('Awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  findAll(): Promise<Award[]> {
    return this.awardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Award> {
    return this.awardsService.findOne(id);
  }

  @Post()
  create(@Body() createAwardDto: CreateAwardDto): Promise<Award> {
    return this.awardsService.create(createAwardDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAwardDto: UpdateAwardDto,
  ): Promise<Award> {
    return this.awardsService.update(id, updateAwardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<Award> {
    return this.awardsService.remove(id);
  }
}
