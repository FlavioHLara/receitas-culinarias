import * as receitaRepository from '../../../repositories/receita.repository';
import * as receitaService from '../../../services/receita.service';
import { AppError } from '../../../errors/AppError';
import { MensagensReceita } from '../../../constants/mensagens';
import { ReceitaComCategoria } from '../../../types/receita';

jest.mock('../../../repositories/receita.repository');

const mockRepo = receitaRepository as jest.Mocked<typeof receitaRepository>;

function fakeReceita(overrides: Partial<ReceitaComCategoria> = {}): ReceitaComCategoria {
    return {
        id: 1,
        id_usuarios: 1,
        id_categorias: 1,
        nome: 'Bolo de fubá',
        tempo_preparo_minutos: 40,
        porcoes: 8,
        modo_preparo: 'Misture e asse',
        ingredientes: 'Fubá, leite',
        criado_em: new Date(),
        alterado_em: new Date(),
        categoria_nome: 'Bolos e tortas doces',
        ...overrides,
    };
}

describe('receita.service', () => {

    describe('listar', () => {
        it('deve retornar receitas do usuário com os filtros aplicados', async () => {
            const receitas = [fakeReceita()];
            mockRepo.listarPorUsuario.mockResolvedValue(receitas);

            const resultado = await receitaService.listar(1, { nome: 'bolo' });

            expect(resultado).toEqual(receitas);
            expect(mockRepo.listarPorUsuario).toHaveBeenCalledWith(1, { nome: 'bolo' });
        })
    })

    describe('buscarPorId', () => {
        it('deve retornar a receita quando pertence ao usuário', async () => {
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id_usuarios: 1 }));

            const resultado = await receitaService.buscarPorId(1, 1);

            expect(resultado.id).toBe(1);
        })

        it('deve lançar 404 quando receita não existe', async () => {
            mockRepo.buscarPorId.mockResolvedValue(null);

            await expect(receitaService.buscarPorId(99, 1))
                .rejects.toMatchObject({
                    statusCode: 404,
                    message: MensagensReceita.NAO_ENCONTRADA,
                });
        })

        it('deve lançar 403 quando receita é de outro usuário', async () => {
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id_usuarios: 2 }));

            await expect(receitaService.buscarPorId(1, 1))
                .rejects.toMatchObject({
                    statusCode: 403,
                    message: MensagensReceita.SEM_PERMISSAO,
                });
        })
    })

    describe('criar', () => {
        it('deve criar receita e retornar com categoria', async () => {
            mockRepo.criar.mockResolvedValue(10);
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id: 10 }));

            const resultado = await receitaService.criar(
                { modo_preparo: 'Misture' },
                1,
            );

            expect(resultado.id).toBe(10);
            expect(mockRepo.criar).toHaveBeenCalledWith(
                { modo_preparo: 'Misture' },
                1,
            );
        })
    })

    describe('atualizar', () => {
        it('deve atualizar receita do próprio usuário', async () => {
            mockRepo.buscarPorId
                .mockResolvedValueOnce(fakeReceita({ id_usuarios: 1 }))
                .mockResolvedValueOnce(fakeReceita({ id_usuarios: 1, nome: 'Novo nome' }));

            const resultado = await receitaService.atualizar(1, { nome: 'Novo nome' }, 1);

            expect(resultado.nome).toBe('Novo nome');
            expect(mockRepo.atualizar).toHaveBeenCalledWith(1, { nome: 'Novo nome' });
        })

        it('deve lançar 403 ao tentar atualizar receita de outro usuário', async () => {
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id_usuarios: 2 }));

            await expect(receitaService.atualizar(1, { nome: 'X' }, 1))
                .rejects.toMatchObject({
                    statusCode: 403,
                });
            expect(mockRepo.atualizar).not.toHaveBeenCalled();
        })
    })

    describe('deletar', () => {
        it('deve deletar receita do próprio usuário', async () => {
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id_usuarios: 1 }));

            await receitaService.deletar(1, 1);

            expect(mockRepo.deletar).toHaveBeenCalledWith(1);
        })

        it('deve lançar 403 ao tentar deletar receita de outro usuário', async () => {
            mockRepo.buscarPorId.mockResolvedValue(fakeReceita({ id_usuarios: 2 }));

            await expect(receitaService.deletar(1, 1))
                .rejects.toThrow(AppError);
            expect(mockRepo.deletar).not.toHaveBeenCalled();
        })
    })
})
