import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

interface TokenPayload {
    usuarioId: number;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            usuarioId?: number;
        }
    }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) {
        return next(new AppError('Token não informado', 401))
    }

    const [, token] = header.split(' ');
    if (!token) {
        return next(new AppError('Token mal formatado', 401));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET não configurado');
        }
        const payload = jwt.verify(token, secret) as TokenPayload;
        req.usuarioId = payload.usuarioId;
        return next();
    } catch {
        return next(new AppError('Token inválido', 401));
    }
}
