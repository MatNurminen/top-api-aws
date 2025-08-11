import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DraftDetailParamsDto {
  @ApiProperty({ description: 'ID of the nation' })
  @IsOptional()
  @IsInt()
  nationId?: number;

  @ApiProperty({ description: 'ID of the team' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;
}
