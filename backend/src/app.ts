import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import receitaRoutes from "./routes/receita.routes";
import categoriaRoutes from './routes/categoria.routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
})
app.use('/auth', authRoutes);
app.use('/receita', receitaRoutes);
app.use('/categoria', categoriaRoutes);
app.use(errorHandler);

export default app;
