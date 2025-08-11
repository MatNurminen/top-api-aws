import { PartialType } from '@nestjs/swagger';
import { CreateTeamTournamentDto } from './create-team-tournament.dto';

export class UpdateTeamTournamentDto extends PartialType(
  CreateTeamTournamentDto,
) {}
