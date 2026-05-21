import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import * as usuarioRepository from '../repositories/usuario.repository';
import { AppError } from '../errors/AppError';
import { CriarUsuarioInput, LoginInput } from '../schemas/auth.schema';
import { UsuarioPublico } from '../types/usuario';

const SALT_ROUNDS = 10;

function gerarToken(usuarioId: number): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET não configurado');
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '8h') as SignOptions['expiresIn'];
    return jwt.sign({ usuarioId }, secret, { expiresIn });
}

export async function criarUsuario(input: CriarUsuarioInput): Promise<UsuarioPublico> {
    const existente = await usuarioRepository.buscarPorLogin(input.login)
    if (existente) {
        throw new AppError('Login já está em uso', 409);
    }

    const senhaHash = await bcrypt.hash(input.senha, SALT_ROUNDS);
    const id = await usuarioRepository.criar({
        nome: input.nome,
        login: input.login,
        senha: senhaHash,
    });

    const usuario = await usuarioRepository.buscarPorId(id)
    if (!usuario) {
        throw new Error('Falha ao recuperar usuário recém criado');
    }

    const { senha, ...publico } = usuario;
    return publico;
}

export async function login(input: LoginInput): Promise<{ token: string; usuario: UsuarioPublico }> {
    const usuario = await usuarioRepository.buscarPorLogin(input.login);
    if (!usuario) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const senhaConfere = await bcrypt.compare(input.senha, usuario.senha);
    if (!senhaConfere) {
        throw new AppError('Credenciais inválidas', 401);
    }

    const token = gerarToken(usuario.id);
    const { senha, ...publico } = usuario;
    return { token, usuario: publico };
}
