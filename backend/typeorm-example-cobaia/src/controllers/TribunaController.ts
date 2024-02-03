// tribuna.controller.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import AppDataSource from '../data-source';
import { Tribuna } from '../entities/Tribunas';

class TribunaController {
  public async getAllTribunas(req: Request, res: Response) {
    try {
      const tribunaRepository = AppDataSource.getRepository(Tribuna);
      const tribunas = await tribunaRepository.find();
      return res.json(tribunas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getTribunaById(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const tribunaRepository = AppDataSource.getRepository(Tribuna);
      const tribuna = await tribunaRepository.findOne({ where: { id } });;

      if (!tribuna) {
        return res.status(404).json({ error: 'Tribuna not found' });
      }

      return res.json(tribuna);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async createTribuna(req: Request, res: Response) {
    try {
      const tribunaRepository = AppDataSource.getRepository(Tribuna);
      const novaTribuna = tribunaRepository.create(req.body);
      const tribuna = await tribunaRepository.save(novaTribuna);
      return res.json(tribuna);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updateTribuna(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const tribunaRepository = AppDataSource.getRepository(Tribuna);
      const tribunaExistente = await tribunaRepository.findOne({ where: { id } });

      if (!tribunaExistente) {
        return res.status(404).json({ error: 'Tribuna not found' });
      }

      tribunaRepository.merge(tribunaExistente, req.body);
      const tribunaAtualizada = await tribunaRepository.save(tribunaExistente);

      return res.json(tribunaAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteTribuna(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const tribunaRepository = AppDataSource.getRepository(Tribuna);
      const tribunaExistente = await tribunaRepository.findOne({ where: { id } });;

      if (!tribunaExistente) {
        return res.status(404).json({ error: 'Tribuna not found' });
      }

      await tribunaRepository.remove(tribunaExistente);

      return res.json({ message: 'Tribuna removida com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new TribunaController();
