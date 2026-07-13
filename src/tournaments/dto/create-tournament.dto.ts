import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateTournamentDto {
  @ApiProperty({ description: 'The id of a season' })
  @IsInt()
  readonly season_id: number;

  @ApiProperty({ description: 'The id of a league' })
  @IsInt()
  readonly league_id: number;

  @ApiProperty({ description: 'The description of a league' })
  @IsString()
  @MaxLength(250)
  readonly description: string;
}
