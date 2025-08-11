import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class MoveFileDto {
  @ApiProperty({ description: 'The name of a file' })
  @IsString()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message:
      'Invalid filename. Use only alphanumeric characters, hyphens, or underscores.',
  })
  filename: string;

  @ApiProperty({ description: 'The name of a target folder' })
  @IsString()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Invalid destination folder name.',
  })
  destinationFolder: string;
}
