import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EventModel from '../models/event.model';
import { MONGODB_URI } from '../config/env';

dotenv.config();

const eventTypes = ['login', 'logout', 'purchase', 'signup', 'view'];
const fakeUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];

function randomEvent() {
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const userId = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
  const value =
    type === 'purchase' ? parseFloat((Math.random() * 500).toFixed(2)) : 0;
  const timestamp = new Date(
    Date.now() - Math.floor(Math.random() * 1000000000)
  );
  return {
    userId,
    type,
    value,
    timestamp,
    metadata: { origin: 'seed-script' },
  };
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB!');

    const oldEvents = await EventModel.find().sort({ timestamp: -1 }).limit(5);
    if (oldEvents.length > 0) {
      console.log('\n📦 Últimos 5 eventos antes da limpeza:');
      oldEvents.forEach((event, index) => {
        console.log(
          `${index + 1}. ${event.userId} - ${event.type} - ${event.timestamp?.toISOString() || 'data inválida'}`
        );
      });
    } else {
      console.log('ℹ️ Nenhum evento antigo encontrado antes da limpeza.');
    }

    const deleted = await EventModel.deleteMany();
    console.log(`🧹 ${deleted.deletedCount} eventos antigos removidos.`);

    const fakeEvents = Array.from({ length: 50 }, () => randomEvent());
    const inserted = await EventModel.insertMany(fakeEvents);
    console.log(`✅ ${inserted.length} eventos falsos inseridos com sucesso.`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular:', err);
    process.exit(1);
  }
}

seed();
