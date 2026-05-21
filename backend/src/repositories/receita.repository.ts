import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
    Receita,
    ReceitaComCategoria,
    CriacaoReceitaInput,
    AtualizacaoReceitaInput,
    FiltroReceita,
} from '../types/receita';

const SELECT_BASE = `
    SELECT r.*, c.nome AS categoria_nome
    FROM receitas r
    LEFT JOIN categorias c ON c.id = r.id_categorias
`;

export async function listarPorUsuario(
    usuarioId: number,
    filtros: FiltroReceita,
): Promise<ReceitaComCategoria[]> {
    let sql = SELECT_BASE + ' WHERE r.id_usuarios = ?';
    const params: (string | number)[] = [usuarioId];

    if (filtros.nome) {
        sql += ' AND r.nome LIKE ?';
        params.push(`%${filtros.nome}%`);
    }
    if (filtros.id_categorias) {
        sql += ' AND r.id_categorias = ?';
        params.push(filtros.id_categorias);
    }

    sql += ' ORDER BY r.criado_em DESC';

    const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
    return rows as ReceitaComCategoria[];
}

export async function buscarPorId(id: number): Promise<ReceitaComCategoria | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        SELECT_BASE + ' WHERE r.id = ? LIMIT 1',
        [id],
    );
    if (rows.length === 0) {
        return null;
    }
    return rows[0] as ReceitaComCategoria;
}

export async function criar(
    input: CriacaoReceitaInput,
    usuarioId: number,
): Promise<number> {
    const agora = new Date();
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO receitas
         (id_usuarios, id_categorias, nome, tempo_preparo_minutos, porcoes, modo_preparo, ingredientes, criado_em, alterado_em)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuarioId,
            input.id_categorias ?? null,
            input.nome ?? null,
            input.tempo_preparo_minutos ?? null,
            input.porcoes ?? null,
            input.modo_preparo,
            input.ingredientes ?? null,
            agora,
            agora,
        ],
    );
    return result.insertId;
}

const CAMPOS_ATUALIZAVEIS: (keyof AtualizacaoReceitaInput)[] = [
    'nome',
    'id_categorias',
    'tempo_preparo_minutos',
    'porcoes',
    'modo_preparo',
    'ingredientes',
];

export async function atualizar(
    id: number,
    input: AtualizacaoReceitaInput,
): Promise<void> {
    const setClauses: string[] = [];
    const valores: (string | number | Date | null)[] = [];

    for (const campo of CAMPOS_ATUALIZAVEIS) {
        if (input[campo] !== undefined) {
            setClauses.push(`${campo} = ?`);
            valores.push(input[campo] as string | number | null);
        }
    }

    if (setClauses.length === 0) {
        return;
    }

    setClauses.push('alterado_em = ?');
    valores.push(new Date());
    valores.push(id);

    await pool.execute(
        `UPDATE receitas SET ${setClauses.join(', ')} WHERE id = ?`,
        valores,
    );
}

export async function deletar(id: number): Promise<void> {
    await pool.execute('DELETE FROM receitas WHERE id = ?', [id]);
}
