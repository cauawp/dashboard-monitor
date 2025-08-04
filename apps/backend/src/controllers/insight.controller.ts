import { Request, Response } from 'express';
import { generateInsight } from '../services/insight.service';

export const createInsight = async (req: Request, res: Response) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ error: 'Resumo (summary) é obrigatório' });
    }

    const insight = await generateInsight(summary);
    return res.status(200).json({ insight });
  } catch (error) {
    console.error('Erro ao gerar insight:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar insight' });
  }
};
