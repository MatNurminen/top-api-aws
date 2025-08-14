import { Column } from 'typeorm';

export class TeamForNation {
  @Column()
  season_id: number;

  @Column()
  short_name: string;

  @Column()
  postseason: string;

  @Column()
  team_id: number;
}
