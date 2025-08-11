import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreatePlayerTournamentDto {
  @ApiProperty({ description: 'The id of a teams_tournament' })
  @IsInt()
  readonly teams_tournament_id: number;

  @ApiProperty({ description: 'The id of a player' })
  @IsInt()
  readonly player_id: number;

  @ApiPropertyOptional({ description: 'The games of a player' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly games?: number;

  @ApiPropertyOptional({ description: 'The goals of a player' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly goals?: number;

  @ApiPropertyOptional({
    description: 'The postseason description of a player',
  })
  @IsOptional()
  @IsString()
  @Length(0, 250)
  readonly postseason?: string;
}
