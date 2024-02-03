// politico.controller.ts
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Politico } from '../entities/politico';
import AppDataSource from '../data-source';

class PoliticoController {

    public async getAllPoliticos(req: Request, res: Response) {
        try {
            const politicoRepository = AppDataSource.getRepository(Politico);
            const politicos = await politicoRepository.find();
            return res.json(politicos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    public async getPoliticoById(req: Request, res: Response) {
        try {
            const id: number = parseInt(req.params.id, 10); // Convertendo a string para número
            if (isNaN(id)) {
              return res.status(400).json({ error: 'ID deve ser um número válido' });
            }
      
            const politicoRepository = AppDataSource.getRepository(Politico);
            const politico = await politicoRepository.findOne({ where: { id } });
      
            if (!politico) {
              return res.status(404).json({ error: 'Politico not found' });
            }
      
            return res.json(politico);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        }
    // Outras funções para criar, atualizar e deletar políticos, se necessário.
    public async createPolitico(req: Request, res: Response) {
        try {
          const politicoRepository = AppDataSource.getRepository(Politico);
          const novoPolitico = politicoRepository.create(req.body);
          const politico = await politicoRepository.save(novoPolitico);
          return res.json(politico);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    
      public async updatePolitico(req: Request, res: Response) {
        try {
          const id: number = parseInt(req.params.id, 10);
          if (isNaN(id)) {
            return res.status(400).json({ error: 'ID deve ser um número válido' });
          }
    
          const politicoRepository = AppDataSource.getRepository(Politico);
          const politicoExistente = await politicoRepository.findOne({ where: { id } });
    
          if (!politicoExistente) {
            return res.status(404).json({ error: 'Politico not found' });
          }
    
          politicoRepository.merge(politicoExistente, req.body);
          const politicoAtualizado = await politicoRepository.save(politicoExistente);
    
          return res.json(politicoAtualizado);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    
      public async deletePolitico(req: Request, res: Response) {
        try {
          const id: number = parseInt(req.params.id, 10);
          if (isNaN(id)) {
            return res.status(400).json({ error: 'ID deve ser um número válido' });
          }
    
          const politicoRepository = AppDataSource.getRepository(Politico);
          const politicoExistente = await politicoRepository.findOne({ where: { id } });
    
          if (!politicoExistente) {
            return res.status(404).json({ error: 'Politico not found' });
          }
    
          await politicoRepository.remove(politicoExistente);
    
          return res.json({ message: 'Politico removido com sucesso' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
}

export default new PoliticoController();
