"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAggregates = exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
exports.retryCreateEvent = retryCreateEvent;
const node_cache_1 = __importDefault(require("node-cache"));
const event_model_1 = __importDefault(require("../models/event.model"));
const logger_1 = require("../utils/logger");
const MAX_RETRIES = 5;
const aggCache = new node_cache_1.default({ stdTTL: 60 }); // Cache válido 60s
async function retryCreateEvent(data, attempt = 1) {
    try {
        return await (0, exports.createEvent)(data);
    }
    catch (error) {
        if (attempt >= MAX_RETRIES) {
            logger_1.logger.error('Falha no processamento do webhook após 5 tentativas', error);
            throw error;
        }
        const delay = 2 ** attempt * 1000; // backoff 2 / 4 / 8 / 16 / 32s
        logger_1.logger.warn(`Erro ao criar evento, retry #${attempt} em ${delay}ms`);
        await new Promise((res) => setTimeout(res, delay));
        return retryCreateEvent(data, attempt + 1);
    }
}
const createEvent = async (data) => {
    const event = await event_model_1.default.create(data);
    logger_1.logger.info(`Novo evento registrado: ${event.type} - ${event.userId}`);
    // Limpa cache para forçar atualização nas próximas requisições
    aggCache.del('aggregates');
    return event;
};
exports.createEvent = createEvent;
const getEvents = async (query) => {
    const { type, from, to, page = 1, limit = 20 } = query;
    const filter = {};
    if (type)
        filter.type = type;
    if (from || to) {
        filter.timestamp = {};
        if (from)
            filter.timestamp.$gte = new Date(from);
        if (to)
            filter.timestamp.$lte = new Date(to);
    }
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const total = await event_model_1.default.countDocuments(filter);
    const events = await event_model_1.default.find(filter)
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
exports.getEvents = getEvents;
const getEventById = async (id) => {
    return await event_model_1.default.findById(id);
};
exports.getEventById = getEventById;
const updateEvent = async (id, data) => {
    return await event_model_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateEvent = updateEvent;
const deleteEvent = async (id) => {
    return await event_model_1.default.findByIdAndDelete(id);
};
exports.deleteEvent = deleteEvent;
const getAggregates = async () => {
    const cached = aggCache.get('aggregates');
    if (cached) {
        logger_1.logger.info('Retornando agregados do cache');
        return cached;
    }
    const [perType, ticketAverage, topUsers] = await Promise.all([
        event_model_1.default.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
        event_model_1.default.aggregate([
            { $match: { type: 'purchase' } },
            { $group: { _id: null, avg: { $avg: '$value' } } },
        ]),
        event_model_1.default.aggregate([
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
exports.getAggregates = getAggregates;
