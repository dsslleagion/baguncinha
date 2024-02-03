// politicas-publicas.controller.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import AppDataSource from '../data-source';
import { PoliticasPublicas } from '../entities/PoliticasPublicas';

class PoliticasPublicasController {
  public async getAllPoliticasPublicas(req: Request, res: Response) {
    try {
      const politicasPublicasRepository = AppDataSource.getRepository(PoliticasPublicas);
      const politicasPublicas = await politicasPublicasRepository.find();
      return res.json(politicasPublicas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getPoliticasPublicasById(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const politicasPublicasRepository = AppDataSource.getRepository(PoliticasPublicas);
      const politicasPublicas = await politicasPublicasRepository.findOne({ where: { id } });

      if (!politicasPublicas) {
        return res.status(404).json({ error: 'PoliticasPublicas not found' });
      }

      return res.json(politicasPublicas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async createPoliticasPublicas(req: Request, res: Response) {
    try {
      const politicasPublicasRepository = AppDataSource.getRepository(PoliticasPublicas);
      const novasPoliticasPublicas = politicasPublicasRepository.create(req.body);
      const politicasPublicas = await politicasPublicasRepository.save(novasPoliticasPublicas);
      return res.json(politicasPublicas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async updatePoliticasPublicas(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const politicasPublicasRepository = AppDataSource.getRepository(PoliticasPublicas);
      const politicasPublicasExistente = await politicasPublicasRepository.findOne({ where: { id } });

      if (!politicasPublicasExistente) {
        return res.status(404).json({ error: 'PoliticasPublicas not found' });
      }

      politicasPublicasRepository.merge(politicasPublicasExistente, req.body);
      const politicasPublicasAtualizada = await politicasPublicasRepository.save(politicasPublicasExistente);

      return res.json(politicasPublicasAtualizada);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deletePoliticasPublicas(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID deve ser um número válido' });
      }

      const politicasPublicasRepository = AppDataSource.getRepository(PoliticasPublicas);
      const politicasPublicasExistente = await politicasPublicasRepository.findOne({ where: { id } });

      if (!politicasPublicasExistente) {
        return res.status(404).json({ error: 'PoliticasPublicas not found' });
      }

      await politicasPublicasRepository.remove(politicasPublicasExistente);

      return res.json({ message: 'PoliticasPublicas removidas com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new PoliticasPublicasController();
