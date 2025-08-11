import { IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlayersStatsDetailParamsDto {
  @ApiProperty({ description: 'ID(s) of the league' })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  leagueId?: number[];

  @ApiProperty({
    description: 'IDs of leagues to exclude',
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  excludeLeagueId?: number[];

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiProperty({ description: 'ID of the nation' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  nationId?: number;

  @ApiProperty({ description: 'ID of the season' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seasonId?: number;

  @ApiProperty({ description: 'ID of the player' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  playerId?: number;

  @ApiProperty({ description: 'Role(s) of the player' })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  playerOrd?: number[];

  @ApiProperty({ description: 'Type ID of the league' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;

  @ApiProperty({ description: 'Limit of results' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
