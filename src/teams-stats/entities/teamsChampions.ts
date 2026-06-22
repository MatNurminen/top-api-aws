import { Column } from 'typeorm';

export class TeamChampion {
  @Column()
  season_id: number;

  @Column()
  team_id: number;

  @Column()
  full_name: string;

  @Column()
  postseason?: Record<string, any> | null;
}
