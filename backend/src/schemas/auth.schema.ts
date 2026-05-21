import { z } from 'zod'
import { MensagensValidacao } from '../constants/mensagens'

export const criaUsuarioSchema = z.object({
    nome: z.string().min(1).optional(),
    login: z.string().min(3, MensagensValidacao.LOGIN_MIN_CARACTERES),
    senha: z.string().min(6, MensagensValidacao.SENHA_MIN_CARACTERES),
})

export const loginSchema = z.object({
    login: z.string().min(1, MensagensValidacao.LOGIN_OBRIGATORIO),
    senha: z.string().min(1, MensagensValidacao.SENHA_OBRIGATORIA),
})

export type CriarUsuarioInput = z.infer<typeof criaUsuarioSchema>
export type LoginInput = z.infer<typeof loginSchema>
