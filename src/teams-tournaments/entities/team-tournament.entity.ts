import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('jsonb', { nullable: true })
  postseason?: Record<string, any> | null;
}
