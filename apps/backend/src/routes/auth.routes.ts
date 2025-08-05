import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

const router = Router();

// Ez login fixo
const USER = {
  username: 'admin',
  password: '123456',
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // exige HTTPS em produção
      sameSite: 'lax', // ou 'none' se estiver em domínios diferentes com HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });

    return res.json({ token });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

export default router;
