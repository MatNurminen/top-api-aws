import { Column, PrimaryColumn } from 'typeorm';

export class TeamByLeague {
  @PrimaryColumn()
  id: number;

  @Column()
  nation_id: number;

  @Column()
  full_name: string;

  @Column()
  flag: string;

  @Column()
  logo: string;
}
