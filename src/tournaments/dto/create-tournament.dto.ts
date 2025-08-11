import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateTournamentDto {
  @ApiProperty({ description: 'The id of a season' })
  @IsInt()
  readonly season_id: number;

  @ApiProperty({ description: 'The id of a league' })
  @IsInt()
  readonly league_id: number;
}
