import { z } from 'zod'

export const criaUsuarioSchema = z.object({
    nome: z.string().min(1).optional(),
    login: z.string().min(3, 'Login precisa ter no mínimo 3 caracteres'),
    senha: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
})

export const loginSchema = z.object({
    login: z.string().min(1, 'Login é obrigatório'),
    senha: z.string().min(1, 'Senha é obrigatória'),
})

export type CriarUsuarioInput = z.infer<typeof criaUsuarioSchema>
export type LoginInput = z.infer<typeof loginSchema>
