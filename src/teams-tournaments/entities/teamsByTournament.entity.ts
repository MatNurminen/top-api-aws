import { Column, PrimaryColumn } from 'typeorm';

export class TeamsByTournament {
  @PrimaryColumn()
  id: number;

  @Column()
  team_id: number;

  @Column()
  full_name: string;

  @Column()
  flag: string;

  @Column()
  league_id: number;

  @Column()
  league_name: string;

  @Column()
  season_id: number;

  @Column()
  season_name: string;
}
