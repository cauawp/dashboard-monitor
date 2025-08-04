import { Router } from 'express';
import { createInsight } from '../controllers/insight.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, createInsight);

export default router;
