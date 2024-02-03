// usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Tribuna } from './Tribunas'; // Corrigindo o nome do arquivo de importação
import { PoliticasPublicas } from './PoliticasPublicas'; // Corrigindo o nome do arquivo de importação
import * as bcrypt from 'bcrypt';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nomeCompleto: string;

  @Column({ nullable: false })
  endereco: string;

  @Column({ nullable: false })
  cep: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false, length: 200 })
  senha: string;

  @Column({ nullable: false })
  telefone: string;

  @Column({ nullable: false })
  movimentosSociais: string;

  @Column({ nullable: false })
  filiacaoPartidaria: string;

  @Column({ nullable: false })
  tipoUsuario: string;

  @ManyToOne(() => Tribuna, tribuna => tribuna.usuarios)
  tribuna: Tribuna;

  @ManyToMany(() => PoliticasPublicas)
  @JoinTable()
  politicasPublicas: PoliticasPublicas[];

  @BeforeInsert() // A função hashSenha é disparada antes do insert e update
  @BeforeUpdate()
  hashSenha(): void {
    if (this.senha) {
      // A senha é codificada usando o algoritmo do pacote bcrypt
      this.senha = bcrypt.hashSync(this.senha, bcrypt.genSaltSync(10));
    }
  }

  compare(input: string): Promise<boolean> {
    // A senha fornecida em input é comparada com a senha do registro armazenado no SGBD
    return bcrypt.compare(input, this.senha);
  }
}
