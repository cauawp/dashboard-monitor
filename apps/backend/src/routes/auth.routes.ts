import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

const router = Router();

// Usuário fixo
const USER = {
  username: 'admin',
  password: '123456',
};

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,   
      sameSite: 'none', 
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    });

    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.json({ success: true });
});

export default router;
