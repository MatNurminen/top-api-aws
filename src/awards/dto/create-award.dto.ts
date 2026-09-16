import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAwardDto {
  @ApiProperty({ description: 'The id of a league' })
  @IsInt()
  readonly league_id: number;

  @ApiProperty({ description: 'The name of at award' })
  @IsString()
  readonly name: string;
}
