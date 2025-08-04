import { Router } from 'express';
import * as EventController from '../controllers/event.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/webhook', EventController.receiveWebhook);

router.get('/', verifyToken, EventController.listEvents);
router.get('/aggregate', verifyToken, EventController.getAggregatedData);
router.get('/:id', verifyToken, EventController.getEvent);
router.put('/:id', verifyToken, EventController.updateEvent);
router.delete('/:id', verifyToken, EventController.deleteEvent);

export default router;
