"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.getAggregatedData = exports.listEvents = exports.receiveWebhook = void 0;
const EventService = __importStar(require("../services/event.service"));
const index_1 = require("../sockets/index");
const logger_1 = require("../utils/logger");
const receiveWebhook = async (req, res) => {
    logger_1.logger.info(`Evento Webhook Recebido: ${JSON.stringify(req.body, null, 2)}`);
    try {
        const event = await EventService.retryCreateEvent(req.body);
        if (index_1.io) {
            index_1.io.emit('new_event', event);
            console.log('Evento emitido com sucesso');
        }
        else {
            logger_1.logger.warn('Socket.io não inicializado - emit ignorado');
        }
        res.status(200).json({ success: true, data: event });
    }
    catch (error) {
        logger_1.logger.error('Erro ao processar webhook após retries', error);
        res.status(500).json({ error: 'Falha ao processar evento' });
    }
};
exports.receiveWebhook = receiveWebhook;
const listEvents = async (req, res) => {
    const result = await EventService.getEvents(req.query);
    res.json(result);
};
exports.listEvents = listEvents;
const getAggregatedData = async (_req, res) => {
    const data = await EventService.getAggregates();
    res.json(data);
};
exports.getAggregatedData = getAggregatedData;
const getEvent = async (req, res) => {
    const event = await EventService.getEventById(req.params.id);
    if (!event)
        return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
};
exports.getEvent = getEvent;
const updateEvent = async (req, res) => {
    const event = await EventService.updateEvent(req.params.id, req.body);
    if (!event)
        return res.status(404).json({ error: 'Evento não encontrado' });
    res.json(event);
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const event = await EventService.deleteEvent(req.params.id);
    if (!event)
        return res.status(404).json({ error: 'Evento não encontrado' });
    res.json({ message: 'Evento deletado com sucesso' });
};
exports.deleteEvent = deleteEvent;
