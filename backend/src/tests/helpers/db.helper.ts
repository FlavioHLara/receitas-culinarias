import { pool } from '../../config/db';
import request from 'supertest';
import app from '../../app';

export async function limparBanco() {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE receitas');
    await pool.query('TRUNCATE TABLE usuarios');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}

export async function fecharConexao() {
    await pool.end();
}

export interface SessaoTeste {
    token: string;
    usuarioId: number;
}

export async function registrarELogar(
    login = 'usuarioteste',
    senha = '123456',
): Promise<SessaoTeste> {
    await request(app)
        .post('/auth/cria-usuario')
        .send({ login, senha });

    const resp = await request(app)
        .post('/auth/login')
        .send({ login, senha });

    return {
        token: resp.body.token,
        usuarioId: resp.body.usuario.id,
    };
}
