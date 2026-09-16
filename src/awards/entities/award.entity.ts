import { PlayersTournamentsAward } from '../../players-tournaments-awards/entities/players-tournaments-award.entity';
import { League } from '../../leagues/entities/league.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('awards')
export class Award {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  league_id: number;

  @Column()
  name: string;

  @ManyToOne((type) => League, (league) => league.awards)
  @JoinColumn([{ name: 'league_id' }])
  league: League;

  @OneToMany(
    (type) => PlayersTournamentsAward,
    (playersTournamentsAward) => playersTournamentsAward.playerTournament,
    {
      cascade: true,
    },
  )
  players_tournaments_awards?: PlayersTournamentsAward[];
}
