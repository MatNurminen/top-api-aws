import { League } from '../../leagues/entities/league.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('league_logos')
export class LeagueLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_year: number;

  @Column({ nullable: true })
  end_year?: number;

  @Column()
  logo: string;

  @Column({ nullable: true })
  league_id?: number;

  @ManyToOne((type) => League, (league) => league.logos)
  @JoinColumn([{ name: 'league_id' }])
  league: League;
}
