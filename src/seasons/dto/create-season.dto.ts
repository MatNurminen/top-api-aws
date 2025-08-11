import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Length, Min, Max } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({ description: 'The ID of a season' })
  @IsInt()
  @Min(1980)
  @Max(new Date().getFullYear())
  readonly id: number;

  @ApiProperty({ description: 'The name of a season' })
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty({ description: 'The logo of a season' })
  @IsString()
  @Length(3, 100)
  readonly logo: string;

  @ApiProperty({ description: 'The link of a season' })
  @IsString()
  @Length(3, 100)
  readonly link: string;
}
