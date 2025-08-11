import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsHexColor, IsOptional } from 'class-validator';

export class CreateNationDto {
  @ApiProperty({ description: 'The name of a nation' })
  @IsString()
  @Length(3, 50)
  readonly name: string;

  @ApiProperty({ description: 'The short name of a nation' })
  @IsString()
  @Length(3, 5)
  readonly short_name: string;

  @ApiProperty({ description: 'The flag of a nation' })
  @IsString()
  @Length(3, 120)
  readonly flag: string;

  @ApiProperty({ description: 'The logo of a nation' })
  @IsString()
  @Length(3, 120)
  readonly logo: string;

  @ApiPropertyOptional({ description: 'The color of a nation' })
  @IsOptional()
  @IsString()
  //@IsHexColor()
  readonly color: string;
}
