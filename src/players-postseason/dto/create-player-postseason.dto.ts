import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerPostseasonDto {
  @ApiProperty({ description: 'The title of a player postseason' })
  @IsString()
  @Length(3, 50)
  readonly title: string;

  @ApiProperty({ description: 'The description of a player title' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  readonly description: string;
}
