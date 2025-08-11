import { Column, PrimaryColumn } from 'typeorm';

export class LeagueByNation {
  @PrimaryColumn()
  id: number;

  @Column()
  short_name: string;

  @Column()
  flag: string;
}
