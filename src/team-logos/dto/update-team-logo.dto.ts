import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamLogoDto } from './create-team-logo.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateTeamLogoDto extends PartialType(CreateTeamLogoDto) {
  @ApiPropertyOptional({
    description: 'ID of the logo (required for existing logos)',
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
