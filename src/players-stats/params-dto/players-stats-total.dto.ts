import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsOptional, IsInt, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlayersStatsTotalParamsDto extends PaginationQueryDto {
  @ApiProperty({ description: 'ID of the league' })
  @IsOptional()
  @IsInt()
  leagueId?: number;

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @IsInt()
  teamId?: number;

  @ApiProperty({ description: 'ID of the nation' })
  @IsOptional()
  @IsInt()
  nationId?: number;

  @ApiProperty({ description: 'ID of the player' })
  @IsOptional()
  @IsInt()
  playerId?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  playerOrd?: number[];
}
