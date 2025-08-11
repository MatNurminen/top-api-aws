import { PartialType } from '@nestjs/swagger';
import { CreateNationDto } from './create-nation.dto';

export class UpdateNationDto extends PartialType(CreateNationDto) {}
