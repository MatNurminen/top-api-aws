import { LeagueLogo } from '../../league-logos/entities/league-logo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_types')
export class LeagueType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
