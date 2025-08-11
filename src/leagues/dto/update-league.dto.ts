import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateLeagueDto } from './create-league.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLeagueLogoDto } from '../../league-logos/dto/update-league-logo.dto';

export class UpdateLeagueDto extends PartialType(CreateLeagueDto) {
  @ApiPropertyOptional({ description: 'Array of logos' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLeagueLogoDto)
  readonly logos?: UpdateLeagueLogoDto[];
}
