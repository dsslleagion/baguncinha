// usuario.controller.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import AppDataSource from '../data-source';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../entities/Usuario';
import { generateToken } from '../middlewares';

class UsuarioController {
  public async getAllUsuarios(req: Request, res: Response) {
    try {
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuarios = await usuarioRepository.find();
      return res.json(usuarios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getUsuarioById(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { id } })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario not found' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async postUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const createUsuario = req.body;
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const insertUsuario = new Usuario();
  
      insertUsuario.nomeCompleto = createUsuario.nomeCompleto;
      insertUsuario.endereco = createUsuario.endereco;
      insertUsuario.cep = createUsuario.cep;
      insertUsuario.cidade = createUsuario.cidade;
      insertUsuario.email = createUsuario.email;
      insertUsuario.telefone = createUsuario.telefone;
      insertUsuario.movimentosSociais = createUsuario.movimentosSociais;
      insertUsuario.tipoUsuario = createUsuario.tipoUsuario;
  
      // Hash da senha
      insertUsuario.senha = bcrypt.hashSync(createUsuario.senha, bcrypt.genSaltSync(10));
  
      const allUsuario = await usuarioRepository.save(insertUsuario);
  
      return res.json(allUsuario);
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
  
  public async putUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateUsuarioData = req.body;
      const usuarioRepository = AppDataSource.getRepository(Usuario);

      // Consulta o banco de dados para encontrar o usuário
      const usuario = await usuarioRepository
        .createQueryBuilder("usuario")
        .select()
        .addSelect('usuario.senha') // Se precisar selecionar a senha
        .where("usuario.id = :id", { id })
        .getOne();

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Atualiza os campos do usuário com os dados recebidos
      usuario.nomeCompleto = updateUsuarioData.nomeCompleto || usuario.nomeCompleto;
      usuario.endereco = updateUsuarioData.endereco || usuario.endereco;
      usuario.cep = updateUsuarioData.cep || usuario.cep;
      usuario.cidade = updateUsuarioData.cidade || usuario.cidade;
      usuario.email = updateUsuarioData.email || usuario.email;
      usuario.telefone = updateUsuarioData.telefone || usuario.telefone;
      usuario.movimentosSociais = updateUsuarioData.movimentosSociais || usuario.movimentosSociais;
      usuario.filiacaoPartidaria = updateUsuarioData.filiacaoPartidaria || usuario.filiacaoPartidaria;
      usuario.tipoUsuario = updateUsuarioData.tipoUsuario || usuario.tipoUsuario;

      // Atualiza a senha, se fornecida
      if (updateUsuarioData.senha) {
        usuario.senha = bcrypt.hashSync(updateUsuarioData.senha, bcrypt.genSaltSync(10));
      }

      // Salva as alterações no banco de dados
      const usuarioAtualizado = await usuarioRepository.save(usuario);

      return res.json(usuarioAtualizado);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }




  public async deleteUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const userId: any = req.params.id;
      const usuarioRepository = AppDataSource.getRepository(Usuario);
  
      // Encontra o usuário no banco de dados
      const findUsuario = await usuarioRepository.findOne(userId);
  
      if (!findUsuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Remove o usuário
      const allUsuario = await usuarioRepository.remove(findUsuario);
  
      return res.json(allUsuario);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, senha } = req.body;

    try {
      // Verifica se foram fornecidos os parâmetros
      if (!email || !senha || email.trim() === "" || senha.trim() === "") {
        return res.status(400).json({ error: "E-mail e senha são necessários" });
      }

      // Consulta o banco de dados para encontrar o usuário
      const usuarioRepository = AppDataSource.getRepository(Usuario);
      const usuario = await usuarioRepository.findOne({ where: { email } });

      if (usuario && usuario.id) {
        const isPasswordValid = await usuario.compare(senha);

        if (isPasswordValid) {
          // Cria um token codificando o objeto {id, email, profile}
          const token = await generateToken({ id: usuario.id, email: usuario.email, profile: usuario.tipoUsuario });

          return res.json({
            id: usuario.id,
            nomeCompleto: usuario.nomeCompleto,
            endereco: usuario.endereco,
            cep: usuario.cep,
            cidade: usuario.cidade,
            email: usuario.email,
            telefone: usuario.telefone,
            movimentosSociais: usuario.movimentosSociais,
            filiacaoPartidaria: usuario.filiacaoPartidaria,
            tipoUsuario: usuario.tipoUsuario,
            // tribuna: usuario.tribuna, // Adicione a lógica se necessário
            // politicasPublicas: usuario.politicasPublicas, // Adicione a lógica se necessário
            token
          });
        } else {
          return res.status(400).json({ error: "Dados de login não conferem" });
        }
      } else {
        return res.status(400).json({ error: "Usuário não localizado" });
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  public logout(req: Request, res: Response): void {
    // Limpa o cookie
    res.clearCookie("jwt");

    // Redireciona ou envia uma resposta, dependendo dos requisitos do seu aplicativo
    res.send("Você foi desconectado com sucesso!");
  }
}

export default new UsuarioController();
