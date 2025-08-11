import { Team } from '../../teams/entities/team.entity';
import { Nation } from '../../nations/entities/nation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  jersey_number: number;

  @Column()
  player_position: string;

  @Column()
  player_order: number;

  @Column()
  birth_year: number;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  start_year: number;

  @Column()
  end_year: number;

  @Column()
  nation_id: number;

  @Column()
  draft_team_id: number;

  @ManyToOne((type) => Nation, (nation) => nation.id)
  @JoinColumn([{ name: 'nation_id' }])
  nation: Nation;

  @ManyToOne((type) => Team, (team) => team.id)
  @JoinColumn([{ name: 'draft_team_id' }])
  team: Team;
}
