import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwardsService } from './awards.service';
import { Award } from './entities/award.entity';

@ApiTags('Awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  findAll(): Promise<Award[]> {
    return this.awardsService.findAll();
  }
}
