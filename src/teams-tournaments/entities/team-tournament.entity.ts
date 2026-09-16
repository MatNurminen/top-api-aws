import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Postseason } from '../../postseasons/entities/postseason.entity';

@Entity('teams_tournaments')
export class TeamTournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournament_id: number;

  @Column()
  team_id: number;

  @Column({ nullable: true })
  games?: number;

  @Column({ nullable: true })
  wins?: number;

  @Column({ nullable: true })
  ties?: number;

  @Column({ nullable: true })
  losts?: number;

  @Column({ nullable: true })
  goals_for?: number;

  @Column({ nullable: true })
  goals_against?: number;

  @Column({ nullable: true })
  postseason_id?: number;

  @ManyToOne((type) => Postseason, (postseason) => postseason.teamTournaments)
  @JoinColumn([{ name: 'postseason_id' }])
  postseason: Postseason;
}
