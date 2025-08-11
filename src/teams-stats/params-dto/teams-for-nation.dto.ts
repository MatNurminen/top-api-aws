import { IsOptional, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TeamsForNationDto {
  @ApiProperty({ description: 'ID of the nation' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  nationId?: number;

  @ApiProperty({ description: 'Short Name of the league' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  shortName?: string;

  @ApiProperty({ description: 'Type ID of the league' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeId?: number;

  @ApiProperty({ description: 'Limit of results' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
