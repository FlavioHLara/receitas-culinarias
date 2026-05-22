<template>
  <div class="pagina-centralizada">
    <div class="card">
      <h1>Criar conta</h1>
      <p class="subtitulo">Preencha os dados para se cadastrar</p>

      <form @submit.prevent="cadastrar">
        <div class="campo">
          <label for="nome">Nome <span class="opcional">(opcional)</span></label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            placeholder="Seu nome"
            autocomplete="name"
            :disabled="carregando"
          />
        </div>

        <div class="campo">
          <label for="login">Login</label>
          <input
            id="login"
            v-model="form.login"
            type="text"
            placeholder="Escolha um login"
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
            placeholder="Mínimo 6 caracteres"
            autocomplete="new-password"
            :disabled="carregando"
          />
        </div>

        <div class="campo">
          <label for="confirmar">Confirmar senha</label>
          <input
            id="confirmar"
            v-model="form.confirmar"
            type="password"
            placeholder="Repita a senha"
            autocomplete="new-password"
            :disabled="carregando"
          />
        </div>

        <p class="msg-erro" :style="{ visibility: erro ? 'visible' : 'hidden' }">
          {{ erro || '&nbsp;' }}
        </p>

        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <button type="submit" class="btn-primario" :disabled="carregando || !!sucesso">
          <span v-if="carregando" class="spinner" />
          <span v-else>Criar conta</span>
        </button>
      </form>

      <p class="link-login">
        Já tem conta?
        <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useAuthStore } from '@/stores/auth';

export default Vue.extend({
  name: 'CadastroView',

  data() {
    return {
      form: {
        nome: '',
        login: '',
        senha: '',
        confirmar: '',
      },
      erro: '',
      sucesso: '',
      carregando: false,
    };
  },

  methods: {
    async cadastrar() {
      this.erro = '';

      if (!this.form.login || !this.form.senha) {
        this.erro = 'Login e senha são obrigatórios';
        return;
      }
      if (this.form.login.length < 3) {
        this.erro = 'Login precisa ter no mínimo 3 caracteres';
        return;
      }
      if (this.form.senha.length < 6) {
        this.erro = 'Senha precisa ter no mínimo 6 caracteres';
        return;
      }
      if (this.form.senha !== this.form.confirmar) {
        this.erro = 'As senhas não conferem';
        return;
      }

      this.carregando = true;
      try {
        const authStore = useAuthStore();
        await authStore.criarConta(
          this.form.login,
          this.form.senha,
          this.form.nome || undefined,
        );
        this.sucesso = 'Conta criada com sucesso! Redirecionando...';
        setTimeout(() => {
          this.$router.push({ name: 'login' });
        }, 2000);
      } catch (err: any) {
        this.erro = err.response?.data?.erro || 'Não foi possível criar a conta';
      } finally {
        this.carregando = false;
      }
    },
  },
});
</script>

<style scoped>
.link-login {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--cor-texto-suave);
}

.link-login a {
  color: var(--cor-primaria);
  text-decoration: none;
  font-weight: 600;
}

.link-login a:hover {
  text-decoration: underline;
}
</style>
