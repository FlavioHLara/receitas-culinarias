import request from 'supertest';
import app from '../../app';
import { fecharConexao } from '../helpers/db.helper';

describe('Categorias E2E', () => {

    afterAll(async () => {
        await fecharConexao();
    })

    it('deve listar todas as categorias sem precisar de auth', async () => {
        const resp = await request(app).get('/categoria');

        expect(resp.status).toBe(200);
        expect(Array.isArray(resp.body)).toBe(true);
        expect(resp.body.length).toBeGreaterThan(0);
        expect(resp.body[0]).toHaveProperty('id');
        expect(resp.body[0]).toHaveProperty('nome');
    })
})
