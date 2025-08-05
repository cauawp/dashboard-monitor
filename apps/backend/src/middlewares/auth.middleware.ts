import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
};
