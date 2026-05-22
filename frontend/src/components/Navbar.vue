<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link :to="{ name: 'receitas' }" class="navbar-logo">
        Receitas Culinárias
      </router-link>

      <div class="navbar-direita">
        <span class="navbar-usuario">{{ nomeUsuario }}</span>
        <button class="btn-logout" @click="sair">Sair</button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { useAuthStore } from '@/stores/auth';

export default Vue.extend({
  name: 'Navbar',

  computed: {
    nomeUsuario(): string {
      const authStore = useAuthStore();
      return authStore.usuario?.nome || authStore.usuario?.login || '';
    },
  },

  methods: {
    async sair() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.$router.push({ name: 'login' });
    },
  },
});
</script>

<style scoped>
.navbar {
  background-color: #fff;
  border-bottom: 1px solid #ede9f8;
  position: sticky;
  top: 0;
  z-index: 10;
}

.navbar-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--cor-primaria);
  text-decoration: none;
}

.navbar-direita {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-usuario {
  font-size: 0.875rem;
  color: var(--cor-texto-suave);
}

.btn-logout {
  font-size: 0.875rem;
  color: var(--cor-primaria);
  background: none;
  border: 1px solid var(--cor-primaria);
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.btn-logout:hover {
  background-color: var(--cor-primaria);
  color: #fff;
}
</style>
