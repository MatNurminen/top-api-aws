import { League } from '../../leagues/entities/league.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  league_id: number;

  @Column()
  name: string;

  @ManyToOne((type) => League, (league) => league.awards)
  @JoinColumn([{ name: 'league_id' }])
  league: League;
}
