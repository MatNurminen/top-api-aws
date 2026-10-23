abstract class AwardStats {
  id: number;
  name: string;
  player_id: string;
  fist_name: string;
  last_name: string;
  birth_year: number;
  player_position: string;
  flag: string;
}

export class AwardStatsTotals extends AwardStats {
  awards: number;
}

export class AwardStatsDetails extends AwardStats {
  full_name: string;
  team_id: number;
}

export class AwardByPlayer {
  id: number;
  name: string;
  season_id: number;
  short_name: string;
  league_id: number;
}
