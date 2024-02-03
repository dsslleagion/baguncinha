// noticia.controller.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import AppDataSource from '../data-source';
import { Noticia } from '../entities/Noticia';

class NoticiaController {
  public async getAllNoticias(req: Request, res: Response) {
    try {
      const noticiaRepository = AppDataSource.getRepository(Noticia);
      const noticias = await noticiaRepository.find();
      return res.json(noticias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getNoticiaById(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const noticiaRepository = AppDataSource.getRepository(Noticia);
      const noticia = await noticiaRepository.findOne({ where: { id } });

      if (!noticia) {
        return res.status(404).json({ error: 'Noticia not found' });
      }

      return res.json(noticia);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async createNoticia(req: Request, res: Response) {
    try {
      const noticiaRepository = AppDataSource.getRepository(Noticia);
      const novaNoticia = noticiaRepository.create(req.body);
      const noticia = await noticiaRepository.save(novaNoticia);
      return res.json(noticia);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updateNoticia(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const noticiaRepository = AppDataSource.getRepository(Noticia);
      const noticiaExistente = await noticiaRepository.findOne({ where: { id } });

      if (!noticiaExistente) {
        return res.status(404).json({ error: 'Noticia not found' });
      }

      noticiaRepository.merge(noticiaExistente, req.body);
      const noticiaAtualizada = await noticiaRepository.save(noticiaExistente);

      return res.json(noticiaAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteNoticia(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const noticiaRepository = AppDataSource.getRepository(Noticia);
      const noticiaExistente = await noticiaRepository.findOne({ where: { id } });

      if (!noticiaExistente) {
        return res.status(404).json({ error: 'Noticia not found' });
      }

      await noticiaRepository.remove(noticiaExistente);

      return res.json({ message: 'Noticia removida com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new NoticiaController();
