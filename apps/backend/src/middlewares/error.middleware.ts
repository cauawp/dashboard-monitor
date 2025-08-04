import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno no servidor',
  });
};
