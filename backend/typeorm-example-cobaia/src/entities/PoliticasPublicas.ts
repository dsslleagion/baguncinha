import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Usuario } from './Usuario';

@Entity({ name: 'politicas_publicas' })
export class PoliticasPublicas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @ManyToMany(() => Usuario, usuario => usuario.politicasPublicas)
  @JoinTable()
  usuarios: Usuario[];
}