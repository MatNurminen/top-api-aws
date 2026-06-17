import { CreatePlayerPostseasonDto } from './create-player-postseason.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdatePlayerPostseasonDto extends PartialType(
  CreatePlayerPostseasonDto,
) {
  @ApiPropertyOptional({
    description:
      'ID of the Player Postseason (required for existing Player Tournament)',
  })
  @IsOptional()
  @IsInt()
  id?: number;
}
