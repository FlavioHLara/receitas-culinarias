import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/receitas',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { publica: true },
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('@/views/Cadastro.vue'),
    meta: { publica: true },
  },
  {
    path: '/receitas',
    name: 'receitas',
    component: () => import('@/views/Receitas.vue'),
  },
  {
    path: '/receitas/nova',
    name: 'receita-nova',
    component: () => import('@/views/ReceitaForm.vue'),
  },
  {
    path: '/receitas/:id/editar',
    name: 'receita-editar',
    component: () => import('@/views/ReceitaForm.vue'),
  },
  {
    path: '/receitas/:id',
    name: 'receita-detalhe',
    component: () => import('@/views/ReceitaDetalhe.vue'),
  },
]

const router = new VueRouter({ routes })

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const estaLogado = authStore.estaLogado;
  const rotaPublica = to.meta?.publica;

  if (!rotaPublica && !estaLogado) {
    next({ name: 'login' });
  } else if (rotaPublica && estaLogado) {
    next({ name: 'receitas' });
  } else {
    next();
  }
})

export default router;
