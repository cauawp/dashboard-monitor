import { Server } from 'socket.io';

export let io: Server;

export const initSocket = (server: Server) => {
  io = server;

  io.on('connection', (socket) => {
    console.log('📡 Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('⛔ Cliente desconectado:', socket.id);
    });
  });
};
