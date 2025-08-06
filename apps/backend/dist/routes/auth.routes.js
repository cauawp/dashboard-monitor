"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
// Ez login fixo
const USER = {
    username: 'admin',
    password: '123456',
};
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        const token = jsonwebtoken_1.default.sign({ username }, env_1.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 dia
        });
        return res.json({ token });
    }
    return res.status(401).json({ error: 'Credenciais inválidas' });
});
exports.default = router;
