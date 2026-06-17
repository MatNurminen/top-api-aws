import { PlayerTournament } from '../../players-tournaments/entities/player-tournament.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('players_postseason')
export class PlayerPostseason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  players_tournaments_id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    (type) => PlayerTournament,
    (playerTournament) => playerTournament.postseason,
  )
  @JoinColumn([{ name: 'players_tournaments_id' }])
  playerTournament: PlayerTournament;
}
