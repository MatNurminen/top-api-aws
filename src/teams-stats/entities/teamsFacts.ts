import { Column } from 'typeorm';

export class TeamFact {
  @Column()
  team_id: number;

  @Column()
  full_name: string;

  @Column()
  plrs: number;

  @Column()
  avheight: number;

  @Column()
  avweight: number;

  @Column()
  avage: number;

  @Column()
  logo: string;
}
