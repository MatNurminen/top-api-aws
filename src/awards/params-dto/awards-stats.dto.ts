import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class AwardsStatsParamsDto extends PaginationQueryDto {
  @ApiProperty({ description: 'ID of the league' })
  @IsInt()
  leagueId: number;

  @ApiProperty({ description: 'ID of the award' })
  @IsInt()
  awardId: number;
}
