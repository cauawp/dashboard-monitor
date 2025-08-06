"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.io = void 0;
const initSocket = (server) => {
    exports.io = server;
    exports.io.on('connection', (socket) => {
        console.log('📡 Cliente conectado:', socket.id);
        socket.on('disconnect', () => {
            console.log('⛔ Cliente desconectado:', socket.id);
        });
    });
};
exports.initSocket = initSocket;
