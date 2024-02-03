import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Politico } from './politico';

@Entity({ name: 'noticia' })
export class Noticia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  conteudo: string;

  @Column()
  dataPublicacao: Date;

  @ManyToOne(() => Politico, politico => politico.noticias)
  politico: Politico;
}
