import { League } from '../../leagues/entities/league.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  season_id: number;

  @Column()
  league_id: number;

  @ManyToOne((type) => League, (league) => league.id)
  @JoinColumn([{ name: 'league_id' }])
  league: League;
}
