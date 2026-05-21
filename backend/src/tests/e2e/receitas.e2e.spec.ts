import request from 'supertest';
import app from '../../app';
import { limparBanco, fecharConexao, registrarELogar } from '../helpers/db.helper';

describe('Receitas E2E', () => {

    let token: string;

    beforeEach(async () => {
        await limparBanco();
        const sessao = await registrarELogar('dono', '123456');
        token = sessao.token;
    })

    afterAll(async () => {
        await fecharConexao();
    })

    describe('autenticação', () => {
        it('deve retornar 401 sem token', async () => {
            const resp = await request(app).get('/receita');
            expect(resp.status).toBe(401);
        })

        it('deve retornar 401 com token inválido', async () => {
            const resp = await request(app)
                .get('/receita')
                .set('Authorization', 'Bearer token-falso');
            expect(resp.status).toBe(401);
        })
    })

    describe('POST /receita', () => {
        it('deve criar receita válida e retornar 201', async () => {
            const resp = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nome: 'Bolo de fubá',
                    id_categorias: 1,
                    modo_preparo: 'Misture tudo e asse',
                    ingredientes: 'Fubá, leite, ovos',
                    tempo_preparo_minutos: 40,
                    porcoes: 8,
                });

            expect(resp.status).toBe(201);
            expect(resp.body.id).toBeDefined();
            expect(resp.body.nome).toBe('Bolo de fubá');
            expect(resp.body.categoria_nome).toBe('Bolos e tortas doces');
        })

        it('deve retornar 400 sem modo_preparo', async () => {
            const resp = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Sem modo' });

            expect(resp.status).toBe(400);
        })
    })

    describe('GET /receita', () => {
        it('deve listar apenas receitas do usuário', async () => {
            await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Minha receita', modo_preparo: 'X' });

            // outro usuário com receita
            const outro = await registrarELogar('outro', '123456');
            await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${outro.token}`)
                .send({ nome: 'Receita alheia', modo_preparo: 'Y' });

            const resp = await request(app)
                .get('/receita')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.status).toBe(200);
            expect(resp.body).toHaveLength(1);
            expect(resp.body[0].nome).toBe('Minha receita');
        })

        it('deve filtrar por nome', async () => {
            await request(app).post('/receita').set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Bolo de cenoura', modo_preparo: 'X' });
            await request(app).post('/receita').set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Lasanha', modo_preparo: 'Y' });

            const resp = await request(app)
                .get('/receita?nome=bolo')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.body).toHaveLength(1);
            expect(resp.body[0].nome).toBe('Bolo de cenoura');
        })

        it('deve filtrar por categoria', async () => {
            await request(app).post('/receita').set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Bolo', id_categorias: 1, modo_preparo: 'X' });
            await request(app).post('/receita').set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Bife', id_categorias: 2, modo_preparo: 'Y' });

            const resp = await request(app)
                .get('/receita?id_categorias=2')
                .set('Authorization', `Bearer ${token}`);

            expect(resp.body).toHaveLength(1);
            expect(resp.body[0].nome).toBe('Bife');
        })
    })

    describe('GET /receita/:id', () => {
        it('deve retornar 404 quando não existe', async () => {
            const resp = await request(app)
                .get('/receita/9999')
                .set('Authorization', `Bearer ${token}`);
            expect(resp.status).toBe(404);
        })

        it('deve retornar 403 quando é de outro usuário', async () => {
            const outro = await registrarELogar('outro', '123456');
            const criada = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${outro.token}`)
                .send({ nome: 'Alheia', modo_preparo: 'X' });

            const resp = await request(app)
                .get(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resp.status).toBe(403);
        })
    })

    describe('PUT /receita/:id', () => {
        it('deve atualizar receita própria', async () => {
            const criada = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Original', modo_preparo: 'X' });

            const resp = await request(app)
                .put(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Atualizada' });

            expect(resp.status).toBe(200);
            expect(resp.body.nome).toBe('Atualizada');
        })

        it('deve retornar 403 ao tentar atualizar receita alheia', async () => {
            const outro = await registrarELogar('outro', '123456');
            const criada = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${outro.token}`)
                .send({ nome: 'Alheia', modo_preparo: 'X' });

            const resp = await request(app)
                .put(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Tentando hackear' });

            expect(resp.status).toBe(403);
        })
    })

    describe('DELETE /receita/:id', () => {
        it('deve deletar receita própria', async () => {
            const criada = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${token}`)
                .send({ nome: 'Para deletar', modo_preparo: 'X' });

            const resp = await request(app)
                .delete(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resp.status).toBe(204);

            const checagem = await request(app)
                .get(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(checagem.status).toBe(404);
        })

        it('deve retornar 403 ao tentar deletar receita alheia', async () => {
            const outro = await registrarELogar('outro', '123456');
            const criada = await request(app)
                .post('/receita')
                .set('Authorization', `Bearer ${outro.token}`)
                .send({ nome: 'Alheia', modo_preparo: 'X' });

            const resp = await request(app)
                .delete(`/receita/${criada.body.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resp.status).toBe(403);
        })
    })
})
