import { z } from 'zod';

export const criaReceitaSchema = z.object({
    nome: z.string().min(1).max(45).optional(),
    id_categorias: z.coerce.number().int().positive().optional(),
    tempo_preparo_minutos: z.coerce.number().int().nonnegative().optional(),
    porcoes: z.coerce.number().int().positive().optional(),
    modo_preparo: z.string().min(1, 'Modo de preparo é obrigatório'),
    ingredientes: z.string().optional(),
});

export const atualizaReceitaSchema = criaReceitaSchema.partial();

export const filtroReceitaSchema = z.object({
    nome: z.string().optional(),
    id_categorias: z.coerce.number().int().positive().optional(),
});

export type CriacaoReceitaInput = z.infer<typeof criaReceitaSchema>;
export type AtualizacaoReceitaInput = z.infer<typeof atualizaReceitaSchema>;
export type FiltroReceitaInput = z.infer<typeof filtroReceitaSchema>;
