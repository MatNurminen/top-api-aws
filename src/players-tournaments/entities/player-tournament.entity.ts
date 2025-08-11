import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  postseason: string;
}
