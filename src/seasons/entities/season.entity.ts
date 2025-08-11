import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('seasons')
export class Season {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column()
  link: string;
}
