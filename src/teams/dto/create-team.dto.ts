import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  Length,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateTeamLogoDto } from '../../team-logos/dto/update-team-logo.dto';

export class CreateTeamDto {
  @ApiProperty({ description: 'The full name of a team' })
  @IsString()
  @Length(3, 120)
  readonly full_name: string;

  @ApiProperty({ description: 'The name of a team' })
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({ description: 'The short name of a team' })
  @IsString()
  @Length(3, 5)
  readonly short_name: string;

  @ApiProperty({ description: 'The start year of a team' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly start_year: number;

  @ApiProperty({ description: 'The end year of a league logo' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly end_year?: number;

  @ApiProperty({ description: 'Must be an existing nation ID' })
  @IsInt()
  readonly nation_id: number;

  @ApiPropertyOptional({ description: 'Array of logos' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTeamLogoDto)
  readonly logos?: UpdateTeamLogoDto[];
}
