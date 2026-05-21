import * as receitaRepository from '../repositories/receita.repository';
import { AppError } from '../errors/AppError';
import { MensagensReceita } from '../constants/mensagens';
import {
    ReceitaComCategoria,
    CriacaoReceitaInput,
    AtualizacaoReceitaInput,
    FiltroReceita,
} from '../types/receita';

async function buscarGarantindoPermissao(
    id: number,
    usuarioId: number,
): Promise<ReceitaComCategoria> {
    const receita = await receitaRepository.buscarPorId(id);
    if (!receita) {
        throw new AppError(MensagensReceita.NAO_ENCONTRADA, 404);
    }
    if (receita.id_usuarios !== usuarioId) {
        throw new AppError(MensagensReceita.SEM_PERMISSAO, 403);
    }
    return receita;
}

export async function listar(
    usuarioId: number,
    filtros: FiltroReceita,
): Promise<ReceitaComCategoria[]> {
    return receitaRepository.listarPorUsuario(usuarioId, filtros);
}

export async function buscarPorId(
    id: number,
    usuarioId: number,
): Promise<ReceitaComCategoria> {
    return buscarGarantindoPermissao(id, usuarioId);
}

export async function criar(
    input: CriacaoReceitaInput,
    usuarioId: number,
): Promise<ReceitaComCategoria> {
    const id = await receitaRepository.criar(input, usuarioId);
    const receita = await receitaRepository.buscarPorId(id);
    if (!receita) {
        throw new Error('Falha ao recuperar receita recém criada');
    }
    return receita;
}

export async function atualizar(
    id: number,
    input: AtualizacaoReceitaInput,
    usuarioId: number,
): Promise<ReceitaComCategoria> {
    await buscarGarantindoPermissao(id, usuarioId);
    await receitaRepository.atualizar(id, input);
    const atualizada = await receitaRepository.buscarPorId(id);
    return atualizada!;
}

export async function deletar(id: number, usuarioId: number): Promise<void> {
    await buscarGarantindoPermissao(id, usuarioId);
    await receitaRepository.deletar(id);
}
