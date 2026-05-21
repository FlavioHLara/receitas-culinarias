import * as usuarioRepository from '../../../repositories/usuario.repository';
import * as authService from '../../../services/auth.service';
import bcrypt from "bcrypt";
import { AppError } from '../../../errors/AppError';
import { MensagensAuth } from '../../../constants/mensagens';

jest.mock('../../../repositories/usuario.repository');
jest.mock('bcrypt');

const mockRepo = usuarioRepository as jest.Mocked<typeof usuarioRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('auth.service', () => {

    describe('criarUsuario', () => {
        it('deve criar usuário quando o login não existe', async () => {
            mockRepo.buscarPorLogin.mockResolvedValue(null);
            mockBcrypt.hash.mockImplementation(async () => 'hash-da-senha' as never);
            mockRepo.criar.mockResolvedValue(1);
            mockRepo.buscarPorId.mockResolvedValue({
                id: 1,
                nome: 'Flavio',
                login: 'flavio',
                senha: 'hash-da-senha',
                criado_em: new Date(),
                alterado_em: new Date(),
            })

            const resultado = await authService.criarUsuario({
                nome: 'Flavio',
                login: 'flavio',
                senha: '123456',
            });

            expect(resultado).not.toHaveProperty('senha');
            expect(resultado.login).toBe('flavio');
            expect(mockBcrypt.hash).toHaveBeenCalledWith('123456', 10);
        })

        it('deve lançar AppError 409 quando login já existe', async () => {
            mockRepo.buscarPorLogin.mockResolvedValue({
                id: 1,
                nome: 'Outro',
                login: 'flavio',
                senha: 'hash',
                criado_em: new Date(),
                alterado_em: new Date(),
            });

            await expect(
                authService.criarUsuario({ login: 'flavio', senha: '123456' })
            ).rejects.toThrow(AppError);

            await expect(
                authService.criarUsuario({ login: 'flavio', senha: '123456' })
            ).rejects.toMatchObject({
                statusCode: 409,
                message: MensagensAuth.LOGIN_EM_USO,
            });
        })
    })

    describe('login', () => {
        it('deve retornar token e usuário quando credenciais corretas', async () => {
            mockRepo.buscarPorLogin.mockResolvedValue({
                id: 1,
                nome: 'Flavio',
                login: 'flavio',
                senha: 'hash-da-senha',
                criado_em: new Date(),
                alterado_em: new Date(),
            });
            mockBcrypt.compare.mockImplementation(async () => true as never);

            const resultado = await authService.login({
                login: 'flavio',
                senha: '123456',
            })

            expect(resultado.token).toBeTruthy();
            expect(typeof resultado.token).toBe('string');
            expect(resultado.usuario).not.toHaveProperty('senha');
            expect(resultado.usuario.login).toBe('flavio');
        })

        it('deve lançar 401 quando usuário não existe', async () => {
            mockRepo.buscarPorLogin.mockResolvedValue(null);

            await expect(
                authService.login({ login: 'inexistente', senha: '123456' })
            ).rejects.toMatchObject({
                statusCode: 401,
                message: MensagensAuth.CREDENCIAIS_INVALIDAS,
            })
        })

        it('deve lançar 401 quando senha está errada', async () => {
            mockRepo.buscarPorLogin.mockResolvedValue({
                id: 1,
                nome: 'Flavio',
                login: 'flavio',
                senha: 'hash-da-senha',
                criado_em: new Date(),
                alterado_em: new Date(),
            });
            mockBcrypt.compare.mockImplementation(async () => false as never);

            await expect(
                authService.login({ login: 'flavio', senha: 'errada' })
            ).rejects.toMatchObject({
                statusCode: 401,
                message: MensagensAuth.CREDENCIAIS_INVALIDAS,
            })
        })
    })
})
