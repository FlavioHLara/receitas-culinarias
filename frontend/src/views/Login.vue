<template>
  <div class="pagina-centralizada">
    <div class="card">
      <h1>Receitas Culinárias</h1>
      <p class="subtitulo">Entre na sua conta</p>

      <form @submit.prevent="entrar">
        <div class="campo">
          <label for="login">Login</label>
          <input
            id="login"
            v-model="form.login"
            type="text"
            placeholder="Seu login"
            autocomplete="username"
            :disabled="carregando"
          />
        </div>

        <div class="campo">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="form.senha"
            type="password"
            placeholder="Sua senha"
            autocomplete="current-password"
            :disabled="carregando"
          />
        </div>

        <p class="msg-erro" :style="{ visibility: erro ? 'visible' : 'hidden' }">
          {{ erro || '&nbsp;' }}
        </p>

        <button type="submit" class="btn-primario" :disabled="carregando">
          <span v-if="carregando" class="spinner" />
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="link-cadastro">
        Não tem conta?
        <router-link to="/cadastro">Criar conta</router-link>
      </p>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { useAuthStore } from '@/stores/auth';

export default Vue.extend({
  name: 'LoginView',

  data() {
    return {
      form: {
        login: '',
        senha: '',
      },
      erro: '',
      carregando: false,
    };
  },

  methods: {
    async entrar() {
      this.erro = '';

      if (!this.form.login || !this.form.senha) {
        this.erro = 'Preencha login e senha';
        return;
      }

      this.carregando = true;
      try {
        const authStore = useAuthStore();
        await authStore.login(this.form.login, this.form.senha);
        this.$router.push({ name: 'receitas' });
      } catch (err: any) {
        this.erro = err.response?.data?.erro || 'Não foi possível entrar';
      } finally {
        this.carregando = false;
      }
    },
  },
});
</script>

<style scoped>
.link-cadastro {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--cor-texto-suave);
}

.link-cadastro a {
  color: var(--cor-primaria);
  text-decoration: none;
  font-weight: 600;
}

.link-cadastro a:hover {
  text-decoration: underline;
}
</style>
