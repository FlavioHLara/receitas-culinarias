import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'
import { criaUsuarioSchema, loginSchema } from '../schemas/auth.schema'

export async function criaUsuario(req: Request, res: Response, next: NextFunction) {
    try {
        const dados = criaUsuarioSchema.parse(req.body);
        const usuario = await authService.criarUsuario(dados);
        res.status(201).json(usuario);
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const dados = loginSchema.parse(req.body)
        const resultado = await authService.login(dados);
        res.json(resultado);
    } catch (err) {
        next(err);
    }
}

export async function logout(req: Request, res: Response) {
    res.status(204).send()
}
