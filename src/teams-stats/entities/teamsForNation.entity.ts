import { Column } from 'typeorm';

export class TeamForNation {
  @Column()
  season_id: number;

  @Column()
  short_name: string;

  @Column()
  postseason: string;

  @Column()
  league_id: number;

  @Column()
  team_id: number;
}
