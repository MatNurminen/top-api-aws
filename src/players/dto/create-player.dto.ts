import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsHexColor,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({ description: 'The first name of a player' })
  @IsString()
  @Length(3, 50)
  readonly first_name: string;

  @ApiProperty({ description: 'The last name of a player' })
  @IsString()
  @Length(3, 50)
  readonly last_name: string;

  @ApiProperty({ description: 'The jersey number of a player' })
  @IsInt()
  @Min(1)
  @Max(99)
  readonly jersey_number: number;

  @ApiProperty({ description: 'The position of a player' })
  @IsString()
  @Length(1, 5)
  readonly player_position: string;

  @ApiProperty({ description: 'The order of a player' })
  @IsInt()
  @Min(1)
  @Max(3)
  readonly player_order: number;

  @ApiProperty({ description: 'The birth year of a player' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() - 14)
  readonly birth_year: number;

  @ApiPropertyOptional({ description: 'The height of a player' })
  @IsOptional()
  @IsInt()
  @Min(150)
  @Max(220)
  readonly height?: number;

  @ApiPropertyOptional({ description: 'The weight of a player' })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(200)
  readonly weight?: number;

  @ApiProperty({ description: 'The start year of a player' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly start_year: number;

  @ApiPropertyOptional({ description: 'The end year of a player' })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  readonly end_year?: number;

  @ApiProperty({ description: 'Must be an existing nation ID' })
  @IsInt()
  // @Validate(LeagueIdExists) NEED TO SOLVE IT!!!!!!!
  readonly nation_id: number;

  @ApiPropertyOptional({ description: 'Must be an existing team ID' })
  @IsOptional()
  @IsInt()
  // @Validate(LeagueIdExists) NEED TO SOLVE IT!!!!!!!
  readonly draft_team_id?: number;
}
