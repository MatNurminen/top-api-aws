import { TeamLogo } from '../../team-logos/entities/team-logo.entity';
import { Nation } from '../../nations/entities/nation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column()
  start_year: number;

  @Column({ nullable: true })
  end_year?: number;

  @Column()
  nation_id: number;

  @OneToMany((type) => TeamLogo, (teamLogo) => teamLogo.team, {
    cascade: true,
  })
  logos?: TeamLogo[];

  @ManyToOne((type) => Nation, (nation) => nation.id)
  @JoinColumn([{ name: 'nation_id' }])
  nation: Nation;
}
