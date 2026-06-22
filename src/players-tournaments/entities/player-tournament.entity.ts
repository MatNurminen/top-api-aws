import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('players_tournaments')
export class PlayerTournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teams_tournament_id: number;

  @Column()
  player_id: number;

  @Column()
  games: number;

  @Column()
  goals: number;

  @Column('jsonb', { nullable: true })
  postseason?: Record<string, any> | null;
}
