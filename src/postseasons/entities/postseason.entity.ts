import { TeamTournament } from '../../teams-tournaments/entities/team-tournament.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('postseason')
export class Postseason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    (type) => TeamTournament,
    (teamTournament) => teamTournament.postseason,
  )
  teamTournaments?: TeamTournament[];
}
