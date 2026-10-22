import { Column, PrimaryColumn } from 'typeorm';

abstract class AwardStats {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  player_id: string;

  @Column()
  fist_name: string;

  @Column()
  last_name: string;

  @Column()
  birth_year: number;

  @Column()
  player_position: string;

  @Column()
  flag: string;
}

export class AwardStatsTotals extends AwardStats {
  @Column()
  awards: number;
}

export class AwardStatsDetails extends AwardStats {
  @Column()
  full_name: string;

  @Column()
  team_id: number;
}
