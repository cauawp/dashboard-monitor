import { Request, Response } from 'express';
import * as EventService from '../services/event.service';
import { io } from '../sockets/index';
import { logger } from '../utils/logger';

export const receiveWebhook = async (req: Request, res: Response) => {
  logger.info(`Evento Webhook Recebido: ${JSON.stringify(req.body, null, 2)}`);

  try {
    const event = await EventService.retryCreateEvent(req.body);

    if (io) {
      io.emit('event:new', event);
    } else {
      logger.warn('Socket.io não inicializado - emit ignorado');
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    logger.error('Erro ao processar webhook após retries', error);
    res.status(500).json({ error: 'Falha ao processar evento' });
  }
};

export const listEvents = async (req: Request, res: Response) => {
  const events = await EventService.getEvents(req.query);
  res.json(events);
};

export const getAggregatedData = async (_req: Request, res: Response) => {
  const data = await EventService.getAggregates();
  res.json(data);
};

export const getEvent = async (req: Request, res: Response) => {
  const event = await EventService.getEventById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json(event);
};

export const updateEvent = async (req: Request, res: Response) => {
  const event = await EventService.updateEvent(req.params.id, req.body);
  if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const event = await EventService.deleteEvent(req.params.id);
  if (!event) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json({ message: 'Evento deletado com sucesso' });
};
