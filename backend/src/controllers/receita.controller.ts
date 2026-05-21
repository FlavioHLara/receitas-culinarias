import { Request, Response, NextFunction } from 'express';
import * as receitaService from '../services/receita.service';
import {
    criaReceitaSchema,
    atualizaReceitaSchema,
    filtroReceitaSchema,
} from '../schemas/receita.schema';

export async function listarReceitas(req: Request, res: Response, next: NextFunction) {
    try {
        const filtros = filtroReceitaSchema.parse(req.query);
        const receitas = await receitaService.listar(req.usuarioId!, filtros);
        res.json(receitas);
    } catch (err) {
        next(err);
    }
}

export async function buscarReceitaPorId(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const receita = await receitaService.buscarPorId(id, req.usuarioId!);
        res.json(receita);
    } catch (err) {
        next(err);
    }
}

export async function criaReceita(req: Request, res: Response, next: NextFunction) {
    try {
        const dados = criaReceitaSchema.parse(req.body);
        const receita = await receitaService.criar(dados, req.usuarioId!);
        res.status(201).json(receita);
    } catch (err) {
        next(err);
    }
}

export async function atualizarReceita(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const dados = atualizaReceitaSchema.parse(req.body);
        const receita = await receitaService.atualizar(id, dados, req.usuarioId!);
        res.json(receita);
    } catch (err) {
        next(err);
    }
}

export async function deletarReceita(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        await receitaService.deletar(id, req.usuarioId!);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
