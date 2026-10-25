export class Standing {
  id: number;
  tournament_id: number;
  team_id: number;
  games: number;
  wins: number;
  ties: number;
  losts: number;
  goals_for: number;
  goals_against: number;
  gd: number;
  pts: number;
  full_name: string;
  season_id: number;
  name: string;
  league_id: number;
  season: string;
  logo: string;
  postseason_id?: number;
  postseason?: string;
}
