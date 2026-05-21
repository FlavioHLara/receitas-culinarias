import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { MensagensErro, MensagensValidacao } from '../constants/mensagens';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            erro: MensagensValidacao.DADOS_INVALIDOS,
            detalhes: err.issues.map((i) => ({
                campo: i.path.join('.'),
                mensagem: i.message,
            })),
        })
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ erro: err.message });
    }

    console.error('Erro não tratado:', err);
    return res.status(500).json({ erro: MensagensErro.INTERNO });
}
