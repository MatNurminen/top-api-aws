import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsInt,
  Length,
  IsHexColor,
  Min,
  Max,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLeagueLogoDto } from '../../league-logos/dto/update-league-logo.dto';

export class CreateLeagueDto {
  @ApiProperty({ description: 'The name of a league' })
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({ description: 'The short name of a league' })
  @IsString()
  @Length(2, 12)
  readonly short_name: string;

  @ApiPropertyOptional({ description: 'The color of a league' })
  @IsOptional()
  @IsString()
  @IsHexColor()
  readonly color: string;

  @ApiProperty({ description: 'The start year of a league' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly start_year: number;

  @ApiPropertyOptional({ description: 'The end year of a league' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly end_year?: number;

  @ApiProperty({ description: 'Type id of a league' })
  @IsInt()
  readonly type_id: number;

  @ApiPropertyOptional({ description: 'Array of logos' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLeagueLogoDto)
  readonly logos?: UpdateLeagueLogoDto[];
}
