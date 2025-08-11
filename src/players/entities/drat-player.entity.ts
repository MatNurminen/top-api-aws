export class DraftNation {
  id: number;
  name: string;
  flag: string;
  plrs: number;
}

export class DraftTeam {
  id: number;
  full_name: string;
  logo: string;
  plrs: number;
}

export class DraftDetail {
  league_id?: number;
  short_name?: string;
  id: number;
  player_position: string;
  first_name: string;
  last_name: string;
  draft_team_id: number;
  full_name: string;
  name: string;
  flag: string;
  games_t?: number;
  goals_t?: number;
  years_t?: number;
}
