import { Team } from '../../teams/entities/team.entity';
import { Player } from '../../players/entities/player.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nations')
export class Nation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column()
  flag: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ nullable: true })
  color?: string;

  @OneToMany((type) => Team, (team) => team.nation_id)
  teams?: Team[];

  @OneToMany((type) => Player, (player) => player.nation_id, {
    cascade: true, // ['insert']
  })
  players?: Player[];
}
