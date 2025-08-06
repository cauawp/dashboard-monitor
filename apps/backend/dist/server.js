"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = require("./sockets/index");
const env_1 = require("./config/env");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
(0, index_1.initSocket)(io);
mongoose_1.default.connect(env_1.MONGODB_URI).then(() => {
    console.log('✅ MongoDB conectado');
    server.listen(env_1.PORT, () => console.log(`🚀 Server na porta ${env_1.PORT}`));
});
