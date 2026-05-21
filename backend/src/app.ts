import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
})
app.use('/auth', authRoutes);
app.use(errorHandler);

export default app;
