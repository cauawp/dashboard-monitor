import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import app from './app';
import { initSocket } from './sockets/index';
import { MONGODB_URI, PORT, OPENAI_API_KEY } from './config/env';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

initSocket(io);

mongoose.connect(MONGODB_URI).then(() => {
  console.log('✅ MongoDB conectado');
  server.listen(PORT, () => console.log(`🚀 Server na porta ${PORT}`));
});
