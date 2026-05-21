import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { MensagensAuth } from '../constants/mensagens';

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
        return next(new AppError(MensagensAuth.TOKEN_NAO_INFORMADO, 401))
    }

    const [, token] = header.split(' ');
    if (!token) {
        return next(new AppError(MensagensAuth.TOKEN_MAL_FORMATADO, 401));
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error(MensagensAuth.JWT_SECRET_NAO_CONFIGURADO);
        }
        const payload = jwt.verify(token, secret) as TokenPayload;
        req.usuarioId = payload.usuarioId;
        return next();
    } catch {
        return next(new AppError(MensagensAuth.TOKEN_INVALIDO, 401));
    }
}
