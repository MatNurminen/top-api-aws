import { CreateTeamPostseasonDto } from './create-team-postseason.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';


export class UpdateTeamPostseasonDto extends PartialType(
  CreateTeamPostseasonDto,
) {
  @ApiPropertyOptional({
    description:
      'ID of the Team Postseason (required for existing Team Tournament)',
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
