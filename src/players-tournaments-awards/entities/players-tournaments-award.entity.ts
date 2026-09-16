import { Award } from '../../awards/entities/award.entity';
import { PlayerTournament } from '../../players-tournaments/entities/player-tournament.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('players_tournaments_awards')
export class PlayersTournamentsAward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  players_tournament_id: number;

  @Column()
  award_id: number;

  @ManyToOne(
    (type) => PlayerTournament,
    (playerTournament) => playerTournament.players_tournaments_awards,
  )
  @JoinColumn([{ name: 'players_tournament_id' }])
  playerTournament: PlayerTournament;

  @ManyToOne((type) => Award, (award) => award.players_tournaments_awards)
  @JoinColumn([{ name: 'award_id' }])
  award: Award;
}
