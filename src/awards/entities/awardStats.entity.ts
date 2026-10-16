import { Column, PrimaryColumn } from 'typeorm';

abstract class AwardStats {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fist_name: string;

  @Column()
  last_name: string;

  @Column()
  birth_year: number;

  @Column()
  player_position: string;
}

export class AwardStatsTotals extends AwardStats {
  @Column()
  awards: number;
}

export class AwardStatsDetails extends AwardStats {
  @Column()
  total_awards: number;

  @Column()
  first_award_year: number;

  @Column()
  last_award_year: number;
}
