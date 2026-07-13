import { Column, PrimaryColumn } from 'typeorm';

export class TournamentByLeague {
  @PrimaryColumn()
  id: number;

  @Column()
  season_id: number;

  @Column()
  league_id: number;

  @Column()
  season: string;

  @Column()
  league: string;

  @Column()
  logo: string;
}
