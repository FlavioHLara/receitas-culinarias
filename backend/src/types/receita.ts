export interface Receita {
    id: number;
    id_usuarios: number;
    id_categorias: number | null;
    nome: string | null;
    tempo_preparo_minutos: number | null;
    porcoes: number | null;
    modo_preparo: string;
    ingredientes: string | null;
    criado_em: Date;
    alterado_em: Date;
}

export interface ReceitaComCategoria extends Receita {
    categoria_nome: string | null;
}

export interface CriacaoReceitaInput {
    nome?: string;
    id_categorias?: number;
    tempo_preparo_minutos?: number;
    porcoes?: number;
    modo_preparo: string;
    ingredientes?: string;
}

export interface AtualizacaoReceitaInput {
    nome?: string;
    id_categorias?: number | null;
    tempo_preparo_minutos?: number | null;
    porcoes?: number | null;
    modo_preparo?: string;
    ingredientes?: string | null;
}

export interface FiltroReceita {
    nome?: string;
    id_categorias?: number;
}
