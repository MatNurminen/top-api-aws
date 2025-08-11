import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamLogoDto {
  @ApiProperty({ description: 'The start year of a team logo' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly start_year: number;

  @ApiProperty({ description: 'The end year of a team logo' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly end_year?: number;

  @ApiProperty({ description: 'The path of a team logo' })
  @IsString()
  readonly logo: string;
}
