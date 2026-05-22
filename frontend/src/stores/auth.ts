import { defineStore } from 'pinia';
import { Usuario } from '@/types';
import * as authService from '@/services/auth.service';

function usuarioSalvo(): Usuario | null {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    usuario: usuarioSalvo(),
  }),

  getters: {
    estaLogado: (state) => !!state.token,
  },

  actions: {
    async login(login: string, senha: string) {
      const resultado = await authService.login(login, senha);
      this.token = resultado.token;
      this.usuario = resultado.usuario;
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
      return resultado;
    },

    async logout() {
      try {
        await authService.logout();
      } finally {
        this.token = null;
        this.usuario = null;
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    },

    async criarConta(login: string, senha: string, nome?: string) {
      return authService.criarConta(login, senha, nome);
    },
  },
})
