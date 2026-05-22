import api from './api'
import { Usuario } from '@/types'

interface LoginResponse {
  token: string
  usuario: Usuario
}

export async function login(login: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { login, senha })
  return data
}

export async function criarConta(login: string, senha: string, nome?: string): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/auth/cria-usuario', { login, senha, nome })
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
