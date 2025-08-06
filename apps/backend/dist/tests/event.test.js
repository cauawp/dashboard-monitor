'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
const app_1 = __importDefault(require('../app'));
describe('POST /webhook/event', () => {
  it('deve receber um evento válido', async () => {
    const res = await (0, supertest_1.default)(app_1.default)
      .post('/api/events/webhook')
      .send({
        userId: 'user123',
        type: 'purchase',
        value: 99.9,
        timestamp: new Date(),
        metadata: { campaign: 'test' },
      });
    expect(res.status).toBe(200);
    expect(res.body.data.type).toBe('purchase');
  });
});
