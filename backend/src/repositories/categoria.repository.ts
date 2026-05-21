import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { Categoria } from '../types/categoria';

export async function listarTodas(): Promise<Categoria[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT id, nome FROM categorias ORDER BY nome',
    );
    return rows as Categoria[];
}
