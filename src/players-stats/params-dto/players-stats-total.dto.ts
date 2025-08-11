import { IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlayersStatsTotalParamsDto {
  @ApiProperty({ description: 'ID of the league' })
  @IsOptional()
  @IsInt()
  leagueId?: number;

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

  @ApiProperty({ description: 'ID of the player' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  playerOrd?: number[];

  @ApiProperty({ description: 'Limit of results' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
