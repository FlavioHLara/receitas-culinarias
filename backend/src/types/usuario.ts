export interface Usuario {
    id: number;
    nome: string | null;
    login: string;
    senha: string;
    criado_em: Date;
    alterado_em: Date;
}

export interface CriacaoUsuarioInput {
    nome?: string;
    login: string;
    senha: string;
}

export type UsuarioPublico = Omit<Usuario, 'senha'>
