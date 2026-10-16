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
import { AwardsService } from './awards.service';
import { Award } from './entities/award.entity';
import { CreateAwardDto } from './dto/create-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { AwardStatsDetails, AwardStatsTotals } from './entities/awardStats.entity';

@ApiTags('Awards')
@Controller('awards')
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  @Get()
  findAll(): Promise<Award[]> {
    return this.awardsService.findAll();
  }

  @Get('detail')
  getAwardsStatsDetails(
    @Query('leagueId') leagueId: number,
    @Query('awardId') awardId: number,
  ): Promise<AwardStatsDetails[]> {
    return this.awardsService.awardsStatsDetails({ leagueId, awardId });
  }

  @Get('total')
  getAwardsStatsTotals(
    @Query('leagueId') leagueId: number,
    @Query('awardId') awardId: number,
  ): Promise<AwardStatsTotals[]> {
    return this.awardsService.awardsStatsTotals({ leagueId, awardId });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Award> {
    return this.awardsService.findOne(id);
  }

  @Get('league/:leagueId')
  findByLeague(@Param('leagueId') leagueId: number): Promise<Award[]> {
    return this.awardsService.findAwardsByLeague(leagueId);
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
