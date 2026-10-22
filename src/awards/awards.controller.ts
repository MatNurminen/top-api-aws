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
import {
  AwardStatsDetails,
  AwardStatsTotals,
} from './entities/awardStats.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { AwardsStatsParamsDto } from './params-dto/awards-stats.dto';

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
    @Query() query: AwardsStatsParamsDto,
  ): Promise<PaginatedResponseDto<AwardStatsDetails>> {
    return this.awardsService.awardsStatsDetails(query);
  }

  @Get('total')
  getAwardsStatsTotals(
    @Query() query: AwardsStatsParamsDto,
  ): Promise<PaginatedResponseDto<AwardStatsTotals>> {
    return this.awardsService.awardsStatsTotals(query);
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
