export class PlayerStatTotal {
  player_id: number;
  first_name: string;
  last_name: string;
  player_position: string;
  player_order: number;
  player_flag: string;
  games_t: number;
  goals_t: number;
  start_year: number;
  end_year: number;
  years: number;
}

export class PlayerStatDetail {
  id: number;
  teams_tournament_id: number;
  player_id: number;
  games: number;
  goals: number;
  postseason: string;
  first_name: string;
  last_name: string;
  jersey_number: number;
  player_position: string;
  player_order: number;
  nation_id: number;
  birth_year: number;
  height: number;
  weight: number;
  draft_team_id: number;
  start_year: number;
  end_year: number;
  season_id: number;
  league_id: number;
  team_id: number;
  full_name: string;
  short_name: string;
  name: string;
  player_flag: string;
  team_flag: string;
  type_id: number;
  club_name: string;
}

export class CountPlayerByNation {
  id: number;
  name: string;
  flag: string;
  color: string;
  count: number;
}

export class PlayerStatLeague {
  league_id: number;
  short_name: string;
  logo: string;
  games_t: number;
  goals_t: number;
  years: number;
}

export class PlayerStatTeam {
  team_id: number;
  full_name: string;
  flag: string;
  games_t: number;
  goals_t: number;
  years: number;
}
