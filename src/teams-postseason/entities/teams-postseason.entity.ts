import { TeamTournament } from '../../teams-tournaments/entities/team-tournament.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teams_postseason')
export class TeamPostseason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teams_tournaments_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    (type) => TeamTournament,
    (teamTournament) => teamTournament.postseason,
  )
  @JoinColumn([{ name: 'teams_tournaments_id' }])
  teamTournament: TeamTournament;
}
