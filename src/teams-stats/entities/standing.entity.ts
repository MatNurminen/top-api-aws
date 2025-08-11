import { Column, PrimaryColumn } from 'typeorm';

export class Standing {
  @PrimaryColumn()
  id: number;

  @Column()
  tournament_id: number;

  @Column()
  team_id: number;

  @Column()
  games: number;

  @Column()
  wins: number;

  @Column()
  ties: number;

  @Column()
  losts: number;

  @Column()
  goals_for: number;

  @Column()
  goals_against: number;

  @Column()
  postseason: string;

  @Column()
  gd: number;

  @Column()
  pts: number;

  @Column()
  full_name: string;

  @Column()
  season_id: number;

  @Column()
  name: string;

  @Column()
  season: string;

  @Column()
  logo: string;
}
