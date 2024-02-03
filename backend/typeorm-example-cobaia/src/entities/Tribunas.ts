import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './Usuario';

@Entity({ name: 'tribuna' })
export class Tribuna {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tema: string;

  @OneToMany(() => Usuario, usuario => usuario.tribuna)
  usuarios: Usuario[];
}