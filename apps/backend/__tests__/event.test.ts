import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app';
import EventModel from '../src/models/event.model';

import { MONGODB_URI } from '../src/config/env';

let authToken: string;

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);

  // logando antes
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: '123456' });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body).toHaveProperty('token');
  authToken = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    console.error('Conexão com o MongoDB não está pronta.');
    return;
  }
  const db = mongoose.connection.db;
  await db.dropDatabase();
  await mongoose.disconnect();
});

describe('Eventos API - Testes CRUD e funcionalidades com autenticação', () => {
  let eventId: string;

  it('Deve criar um evento via webhook (POST /api/events/webhook) - Público', async () => {
    const payload = {
      userId: 'user123',
      type: 'purchase',
      value: 120.5,
      timestamp: new Date().toISOString(),
      metadata: { campaign: 'spring-sale' },
    };

    const res = await request(app).post('/api/events/webhook').send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject({
      userId: payload.userId,
      type: payload.type,
      value: payload.value,
      metadata: payload.metadata,
    });
    expect(res.body.data).toHaveProperty('_id');

    eventId = res.body.data._id;
  });

  it('Deve listar eventos com paginação e filtro (GET /api/events) - Requer Auth', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: 1, limit: 10, type: 'purchase' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(10);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('type', 'purchase');
    }
  });

  it('Deve buscar agregados (GET /api/events/aggregate) - Requer Auth', async () => {
    const res = await request(app)
      .get('/api/events/aggregate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('perType');
    expect(res.body).toHaveProperty('ticketAverage');
    expect(res.body).toHaveProperty('topUsers');
  });

  it('Deve atualizar um evento pelo ID (PUT /api/events/:id) - Requer Auth', async () => {
    const updatePayload = { value: 200 };

    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value', 200);

    const updated = await EventModel.findById(eventId).lean();
    expect(updated?.value).toBe(200);
  });

  it('Deve retornar erro 404 ao atualizar evento inexistente - Requer Auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/api/events/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ value: 100 });

    expect(res.status).toBe(404);
  });

  it('Deve obter evento pelo ID (GET /api/events/:id) - Requer Auth', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', eventId);
  });

  it('Deve retornar 404 ao buscar evento inexistente - Requer Auth', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get(`/api/events/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  it('Deve deletar um evento pelo ID (DELETE /api/events/:id) - Requer Auth', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Evento deletado com sucesso');

    const deleted = await EventModel.findById(eventId);
    expect(deleted).toBeNull();
  });

  it('Deve retornar erro 404 ao deletar evento inexistente - Requer Auth', async () => {
    console.log(
      'Após inserir retries para o payload, teste retorna FALHA pois excede o limite padrão jest'
    );

    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .delete(`/api/events/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  it('Deve validar evento com payload inválido (POST /api/events/webhook) - Público', async () => {
    const invalidPayload = {
      userId: '', // null
      type: 'unknown_type', // null
      value: 'not_a_number', // null
    };

    const res = await request(app)
      .post('/api/events/webhook')
      .send(invalidPayload);

    expect(res.status).toBe(400);
  });

  it('Deve retornar "Oi, sou um chat bot" ao solicitar insight (POST /api/insight) - Requqer auth', async () => {
    const res = await request(app).post('/api/insight').send({
      summary:
        'Estou fazendo teste, responda com exatamente um "Oi, sou um chat bot".',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('insight');
    expect(res.body).toHaveProperty('insight', 'Oi, sou um chat bot');
  });
});
