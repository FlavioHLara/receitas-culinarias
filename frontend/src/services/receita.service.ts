import api from './api'
import { Receita, Categoria, ReceitaFormData } from '@/types'

export async function listarReceitas(filtros?: { nome?: string; id_categorias?: number }): Promise<Receita[]> {
  const { data } = await api.get<Receita[]>('/receita', { params: filtros })
  return data
}

export async function buscarReceita(id: number): Promise<Receita> {
  const { data } = await api.get<Receita>(`/receita/${id}`)
  return data
}

export async function criarReceita(dados: ReceitaFormData): Promise<Receita> {
  const { data } = await api.post<Receita>('/receita', dados)
  return data
}

export async function atualizarReceita(id: number, dados: ReceitaFormData): Promise<Receita> {
  const { data } = await api.put<Receita>(`/receita/${id}`, dados)
  return data
}

export async function deletarReceita(id: number): Promise<void> {
  await api.delete(`/receita/${id}`)
}

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categoria')
  return data
}
