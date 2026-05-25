import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlayersStatsDetailParamsDto extends PaginationQueryDto {
  @ApiProperty({ description: 'ID(s) of the league' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  leagueId?: number[];

  @ApiProperty({
    description: 'IDs of leagues to exclude',
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [Number(value)]))
  excludeLeagueId?: number[];

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiProperty({ description: 'ID of the nation' })
  @IsOptional()
  @IsInt()
  nationId?: number;

  @ApiProperty({ description: 'ID of the season' })
  @IsOptional()
  @IsInt()
  seasonId?: number;

  @ApiProperty({ description: 'ID of the player' })
  @IsOptional()
  @IsInt()
  playerId?: number;

  @ApiProperty({ description: 'Role(s) of the player' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  playerOrd?: number[];

  @ApiProperty({ description: 'Type ID of the league' })
  @IsOptional()
  @IsInt()
  typeId?: number;
}
