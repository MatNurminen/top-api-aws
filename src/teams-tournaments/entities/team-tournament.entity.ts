import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('teams_tournaments')
export class TeamTournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournament_id: number;

  @Column()
  team_id: number;

  @Column()
  games: number;

  @Column()
  wins: number;

  @Column()
  ties: number;

  @Column()
  losts: number;

  @Column()
  goals_for: number;

  @Column()
  goals_against: number;

  @Column()
  postseason: string;
}
