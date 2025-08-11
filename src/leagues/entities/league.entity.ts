import { Tournament } from '../../tournaments/entities/tournament.entity';
import { LeagueLogo } from '../../league-logos/entities/league-logo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leagues')
export class League {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column({ nullable: true })
  color?: string;

  @Column()
  start_year: number;

  @Column({ nullable: true })
  end_year?: number;

  @Column()
  type_id: number;

  @OneToMany((type) => LeagueLogo, (leagueLogo) => leagueLogo.league, {
    cascade: true,
  })
  logos?: LeagueLogo[];

  @OneToMany((type) => Tournament, (tournament) => tournament.league_id)
  tournament?: Tournament[];
}
