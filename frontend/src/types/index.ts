export interface Usuario {
  id: number;
  nome: string | null;
  login: string;
  criado_em: string;
  alterado_em: string;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Receita {
  id: number;
  id_usuarios: number;
  id_categorias: number | null;
  nome: string | null;
  tempo_preparo_minutos: number | null;
  porcoes: number | null;
  modo_preparo: string;
  ingredientes: string | null;
  criado_em: string;
  alterado_em: string;
  categoria_nome: string | null;
}

export interface ReceitaFormData {
  nome?: string;
  id_categorias?: number | null;
  tempo_preparo_minutos?: number | null;
  porcoes?: number | null;
  modo_preparo: string;
  ingredientes?: string | null;
}
