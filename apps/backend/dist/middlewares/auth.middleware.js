"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const verifyToken = (req, res, next) => {
    // Tenta pegar do header
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.split(' ')[1];
    // Tenta pegar do cookie
    const tokenFromCookie = req.cookies?.token;
    // Usa o que estiver disponível
    const token = tokenFromHeader || tokenFromCookie;
    if (!token) {
        return res.status(401).json({ error: 'Token ausente' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(403).json({ error: 'Token inválido' });
    }
};
exports.verifyToken = verifyToken;
