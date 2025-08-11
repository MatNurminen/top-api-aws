import { Team } from '../../teams/entities/team.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('team_logos')
export class TeamLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_year: number;

  @Column({ nullable: true })
  end_year?: number;

  @Column()
  logo: string;

  @Column()
  team_id: number;

  @ManyToOne((type) => Team, (team) => team.logos)
  @JoinColumn([{ name: 'team_id' }])
  team: Team;
}
