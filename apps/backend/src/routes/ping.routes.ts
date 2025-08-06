import { Router } from 'express';
import { createInsight } from '../controllers/insight.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('pong');
});

export default router;
