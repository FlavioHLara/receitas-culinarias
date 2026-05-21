import { pool } from '../config/db';
import { Usuario, CriacaoUsuarioInput } from '../types/usuario';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function buscarPorLogin(login: string): Promise<Usuario | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM usuarios WHERE login = ? LIMIT 1',
        [login]
    );
    if (rows.length === 0) {
        return null;
    }
    return rows[0] as Usuario;
}

export async function buscarPorId(id: number): Promise<Usuario | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM usuarios WHERE id = ? LIMIT 1',
        [id]
    );
    if (rows.length === 0) {
        return null;
    }
    return rows[0] as Usuario;
}

export async function criar(input: CriacaoUsuarioInput & { senha: string }): Promise<number> {
    const agora = new Date();
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em)
         VALUES (?, ?, ?, ?, ?)`,
        [input.nome ?? null, input.login, input.senha, agora, agora]
    );
    return result.insertId;
}
