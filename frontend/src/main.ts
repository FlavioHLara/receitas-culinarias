import Vue from 'vue';
import '@/assets/app.css';
import App from './App.vue';
import router from './router';
import { createPinia, setActivePinia } from 'pinia';

const pinia = createPinia();
setActivePinia(pinia);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  render: h => h(App),
}).$mount('#app');
