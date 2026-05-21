import { Request, Response, NextFunction } from 'express';
import * as categoriaRepository from '../repositories/categoria.repository';

export async function listarCategorias(req: Request, res: Response, next: NextFunction) {
    try {
        const categorias = await categoriaRepository.listarTodas();
        res.json(categorias);
    } catch (err) {
        next(err);
    }
}
