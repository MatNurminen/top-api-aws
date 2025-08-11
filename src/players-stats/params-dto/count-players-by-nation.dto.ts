import { IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CountPlayersByNationParamsDto {
  @ApiProperty({ description: 'ID of the league' })
  @IsOptional()
  @IsInt()
  leagueId?: number;

  @ApiProperty({ description: 'ID of the season' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seasonId?: number;

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiProperty({ description: 'Type ID of the league' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;
}
