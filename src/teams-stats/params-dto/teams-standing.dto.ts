import { IsOptional, IsInt, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TeamsStandingDto {
  @ApiProperty({ description: 'ID of the season' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seasonId?: number;

  @ApiProperty({ description: 'ID of the league' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leagueId?: number;

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiProperty({ description: 'Type ID of the team' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;
}
