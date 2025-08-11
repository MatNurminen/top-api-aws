import { CreateLeagueLogoDto } from './create-league-logo.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateLeagueLogoDto extends PartialType(CreateLeagueLogoDto) {
  @ApiPropertyOptional({
    description: 'ID of the logo (required for existing logos)',
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
