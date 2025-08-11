import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateTeamDto } from './create-team.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UpdateTeamLogoDto } from '../../team-logos/dto/update-team-logo.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiPropertyOptional({ description: 'Array of logos' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTeamLogoDto)
  readonly logos?: UpdateTeamLogoDto[];
}
