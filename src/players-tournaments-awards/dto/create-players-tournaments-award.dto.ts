import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayersTournamentsAwardDto {
  @ApiProperty({ description: 'The id of a players_tournament' })
  @IsInt()
  readonly players_tournament_id: number;

  @ApiProperty({ description: 'The id of at award' })
  @IsInt()
  readonly award_id: number;
}
