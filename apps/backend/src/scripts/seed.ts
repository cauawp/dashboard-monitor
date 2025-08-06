import mongoose from "mongoose";
import dotenv from "dotenv";
import EventModel from "../models/event.model";
import { MONGODB_URI } from "../config/env";

dotenv.config();

const eventTypes = ["login", "logout", "purchase", "signup", "view"];
const fakeUsers = ["user1", "user2", "user3", "user4", "user5"];

const products = ["Oil", "Book", "Phone", "Shoes", "Laptop"];
const campaigns = ["summer-sale", "black-friday", "cyber-monday", "launch-day"];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomEvent() {
  const type = getRandom(eventTypes);
  const userId = getRandom(fakeUsers);
  const timestamp = new Date(Date.now() - Math.floor(Math.random() * 1000000000));

  const baseEvent: any = {
    userId,
    type,
    timestamp,
    value: 0,
    metadata: {
      origin: "seed-script",
    },
  };

  if (type === "purchase") {
    baseEvent.value = parseFloat((Math.random() * 10000).toFixed(2));
    baseEvent.metadata = {
      ...baseEvent.metadata,
      product: getRandom(products),
      campaign: getRandom(campaigns),
    };
  }

  return baseEvent;
}

async function insertRandomEvent() {
  const event = randomEvent();
  await EventModel.create(event);
  console.log(`🟢 Evento aleatório inserido: ${event.type} - ${event.userId}`);
}

async function startSeeding() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado ao MongoDB!");

    await EventModel.deleteMany();
    const seedEvents = Array.from({ length: 50 }, randomEvent);
    await EventModel.insertMany(seedEvents);
    console.log(`🚀 50 eventos inseridos.`);

    // Loop infinito para inserir evento a cada X minutos
    setInterval(async () => {
      try {
        await insertRandomEvent();
      } catch (err) {
        console.error("❌ Erro ao inserir evento aleatório:", err);
      }
    }, randomInterval(5, 15)); // Entre 5 e 15 minutos
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

function randomInterval(minMinutes: number, maxMinutes: number): number {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

startSeeding();
