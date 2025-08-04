import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import eventRoutes from './routes/event.routes';
import authRoutes from './routes/auth.routes';
import insightRoutes from './routes/insight.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/insight', insightRoutes);

app.use(errorHandler);

export default app;
