import { PartialType } from '@nestjs/swagger';
import { CreatePlayerTournamentDto } from './create-player-tournament.dto';

export class UpdatePlayerTournamentDto extends PartialType(
  CreatePlayerTournamentDto,
) {}
