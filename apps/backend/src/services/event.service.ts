import NodeCache from 'node-cache';
import EventModel from '../models/event.model';
import { logger } from '../utils/logger';

const MAX_RETRIES = 5;
const aggCache = new NodeCache({ stdTTL: 60 }); // Cache válido 60s

interface CreateEventInput {
  userId: string;
  type: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export async function retryCreateEvent(
  data: CreateEventInput,
  attempt = 1
): Promise<any> {
  try {
    return await createEvent(data);
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      logger.error(
        'Falha no processamento do webhook após 5 tentativas',
        error
      );
      throw error;
    }
    const delay = 2 ** attempt * 1000; // backoff 2 / 4 / 8 / 16 / 32s
    logger.warn(`Erro ao criar evento, retry #${attempt} em ${delay}ms`);
    await new Promise((res) => setTimeout(res, delay));
    return retryCreateEvent(data, attempt + 1);
  }
}

export const createEvent = async (data: CreateEventInput) => {
  const event = await EventModel.create(data);
  logger.info(`Novo evento registrado: ${event.type} - ${event.userId}`);

  // Limpa cache para forçar atualização nas próximas requisições
  aggCache.del('aggregates');

  return event;
};

export const getEvents = async (query: any) => {
  const { type, from, to, page = 1, limit = 20 } = query;

  const filter: any = {};
  if (type) filter.type = type;
  if (from || to) {
    filter.timestamp = {};
    if (from) filter.timestamp.$gte = new Date(from);
    if (to) filter.timestamp.$lte = new Date(to);
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));

  const total = await EventModel.countDocuments(filter);

  const events = await EventModel.find(filter)
    .sort({ timestamp: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  return {
    events,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getEventById = async (id: string) => {
  return await EventModel.findById(id);
};

export const updateEvent = async (
  id: string,
  data: Partial<CreateEventInput>
) => {
  return await EventModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEvent = async (id: string) => {
  return await EventModel.findByIdAndDelete(id);
};

export const getAggregates = async () => {
  const cached = aggCache.get('aggregates');
  if (cached) {
    logger.info('Retornando agregados do cache');
    return cached;
  }

  const [perType, ticketAverage, topUsers] = await Promise.all([
    EventModel.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    EventModel.aggregate([
      { $match: { type: 'purchase' } },
      { $group: { _id: null, avg: { $avg: '$value' } } },
    ]),
    EventModel.aggregate([
      {
        $group: {
          _id: '$userId',
          total: { $sum: '$value' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 3 },
    ]),
  ]);

  const data = {
    perType,
    ticketAverage: ticketAverage[0]?.avg || 0,
    topUsers,
  };

  aggCache.set('aggregates', data);
  return data;
};
