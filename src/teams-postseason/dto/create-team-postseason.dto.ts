import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamPostseasonDto {
  @ApiProperty({ description: 'The title of a team postseason' })
  @IsString()
  @Length(3, 50)
  readonly title: string;

  @ApiProperty({ description: 'The description of a team title' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  readonly description: string;
}
