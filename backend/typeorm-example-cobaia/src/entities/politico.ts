// politico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Noticia } from './Noticia';


@Entity({ name: 'politico' })
export class Politico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeCompleto: string;

  @Column()
  biografia: string;

  @Column()
  partido: string;

  @OneToMany(() => Noticia, noticia => noticia.politico)
  noticias: Noticia[];
}
