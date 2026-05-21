import { pool } from '../../config/db';

export async function limparBanco() {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE receitas');
    await pool.query('TRUNCATE TABLE usuarios');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}

export async function fecharConexao() {
    await pool.end();
}
