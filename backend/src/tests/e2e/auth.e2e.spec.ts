import request from 'supertest';
import app from '../../app';
import { limparBanco, fecharConexao } from '../helpers/db.helper';

describe('Auth E2E', () => {

    beforeEach(async () => {
        await limparBanco();
    })

    afterAll(async () => {
        await fecharConexao();
    })

    describe('POST /auth/cria-usuario', () => {
        it('deve criar usuário com dados válidos e retornar 201', async () => {
            const resp = await request(app)
                .post('/auth/cria-usuario')
                .send({ nome: 'Flavio', login: 'flavio', senha: '123456' });

            expect(resp.status).toBe(201);
            expect(resp.body).toHaveProperty('id');
            expect(resp.body.login).toBe('flavio');
            expect(resp.body).not.toHaveProperty('senha');
        })

        it('deve retornar 409 quando login já existe', async () => {
            await request(app)
                .post('/auth/cria-usuario')
                .send({ login: 'flavio', senha: '123456' });

            const resp = await request(app)
                .post('/auth/cria-usuario')
                .send({ login: 'flavio', senha: 'outraSenha' });

            expect(resp.status).toBe(409);
            expect(resp.body.erro).toBeDefined();
        })

        it('deve retornar 400 quando senha é muito curta', async () => {
            const resp = await request(app)
                .post('/auth/cria-usuario')
                .send({ login: 'flavio', senha: '12' });

            expect(resp.status).toBe(400);
            expect(resp.body.detalhes).toBeInstanceOf(Array);
        })
    })

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/auth/cria-usuario')
                .send({ login: 'flavio', senha: '123456' });
        })

        it('deve retornar token quando credenciais corretas', async () => {
            const resp = await request(app)
                .post('/auth/login')
                .send({ login: 'flavio', senha: '123456' });

            expect(resp.status).toBe(200);
            expect(resp.body.token).toBeTruthy();
            expect(resp.body.usuario.login).toBe('flavio');
            expect(resp.body.usuario).not.toHaveProperty('senha');
        })

        it('deve retornar 401 quando senha errada', async () => {
            const resp = await request(app)
                .post('/auth/login')
                .send({ login: 'flavio', senha: 'errada' });

            expect(resp.status).toBe(401);
        })

        it('deve retornar 401 quando usuário não existe', async () => {
            const resp = await request(app)
                .post('/auth/login')
                .send({ login: 'inexistente', senha: '123456' });

            expect(resp.status).toBe(401);
        })
    })

    describe('POST /auth/logout', () => {
        it('deve retornar 204', async () => {
            const resp = await request(app).post('/auth/logout');
            expect(resp.status).toBe(204);
        })
    })
})
