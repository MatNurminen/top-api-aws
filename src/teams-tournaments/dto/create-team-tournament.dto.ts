import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateTeamTournamentDto {
  @ApiProperty({ description: 'The id of a tournament' })
  @IsInt()
  readonly tournament_id: number;

  @ApiProperty({ description: 'The id of a team' })
  @IsInt()
  readonly team_id: number;

  @ApiPropertyOptional({ description: 'The games of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly games?: number;

  @ApiPropertyOptional({ description: 'The wins of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly wins?: number;

  @ApiPropertyOptional({ description: 'The ties of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly ties?: number;

  @ApiPropertyOptional({ description: 'The losts of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(250)
  readonly losts?: number;

  @ApiPropertyOptional({ description: 'The goals for of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(500)
  readonly goals_for?: number;

  @ApiPropertyOptional({ description: 'The goals against of a team' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(500)
  readonly goals_against?: number;

  @ApiPropertyOptional({ description: 'The postseason description of a team' })
  @IsOptional()
  @IsString()
  @Length(0, 250)
  readonly postseason?: string;
}
