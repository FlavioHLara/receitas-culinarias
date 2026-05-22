<template>
  <div>
    <Navbar />

    <main class="pagina">
      <div class="topo">
        <h2>Minhas Receitas</h2>
        <router-link :to="{ name: 'receita-nova' }" class="btn-primario btn-novo">
          + Nova receita
        </router-link>
      </div>

      <div class="filtros">
        <div class="campo">
          <input
            v-model="filtro.nome"
            type="text"
            placeholder="Buscar por nome..."
            @keyup.enter="buscar"
          />
        </div>
        <div class="campo">
          <select v-model="filtro.id_categorias" @change="buscar">
            <option :value="undefined">Todas as categorias</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nome }}
            </option>
          </select>
        </div>
        <button class="btn-primario btn-buscar" @click="buscar">Buscar</button>
      </div>

      <div v-if="carregando" class="estado-vazio">
        <span class="spinner-escuro" />
        Carregando...
      </div>

      <div v-else-if="receitas.length === 0" class="estado-vazio">
        <p>Nenhuma receita encontrada.</p>
        <router-link :to="{ name: 'receita-nova' }">Criar minha primeira receita</router-link>
      </div>

      <div v-else class="lista">
        <div
          v-for="receita in receitas"
          :key="receita.id"
          class="card-receita"
          @click="verDetalhe(receita.id)"
        >
          <div class="card-receita-corpo">
            <span v-if="receita.categoria_nome" class="tag-categoria">
              {{ receita.categoria_nome }}
            </span>
            <h3>{{ receita.nome || 'Sem título' }}</h3>
            <p class="card-receita-info">
              <span v-if="receita.tempo_preparo_minutos">
                ⏱ {{ receita.tempo_preparo_minutos }} min
              </span>
              <span v-if="receita.porcoes">
                🍽 {{ receita.porcoes }} porções
              </span>
            </p>
          </div>
          <div class="card-receita-acoes" @click.stop>
            <button class="btn-acao" @click="editar(receita.id)">Editar</button>
            <button class="btn-acao btn-acao-perigo" @click="confirmarDelecao(receita)">Excluir</button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="receitaParaDeletar" class="modal-overlay" @click="receitaParaDeletar = null">
      <div class="modal" @click.stop>
        <h3>Excluir receita</h3>
        <p>Tem certeza que quer excluir <strong>{{ receitaParaDeletar.nome || 'esta receita' }}</strong>?</p>
        <div class="modal-acoes">
          <button class="btn-secundario" @click="receitaParaDeletar = null">Cancelar</button>
          <button class="btn-primario btn-perigo" @click="deletar">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from '@/components/Navbar.vue';
import * as receitaService from '@/services/receita.service';
import { Receita, Categoria } from '@/types';

export default Vue.extend({
  name: 'ReceitasView',

  components: { Navbar },

  data() {
    return {
      receitas: [] as Receita[],
      categorias: [] as Categoria[],
      filtro: {
        nome: '',
        id_categorias: undefined as number | undefined,
      },
      carregando: false,
      receitaParaDeletar: null as Receita | null,
    };
  },

  async created() {
    await Promise.all([this.buscar(), this.carregarCategorias()]);
  },

  methods: {
    async buscar() {
      this.carregando = true;
      try {
        const filtros = {
          nome: this.filtro.nome || undefined,
          id_categorias: this.filtro.id_categorias,
        };
        this.receitas = await receitaService.listarReceitas(filtros);
      } catch {
        this.receitas = [];
      } finally {
        this.carregando = false;
      }
    },

    async carregarCategorias() {
      try {
        this.categorias = await receitaService.listarCategorias();
      } catch {
        this.categorias = [];
      }
    },

    verDetalhe(id: number) {
      this.$router.push({ name: 'receita-detalhe', params: { id: String(id) } });
    },

    editar(id: number) {
      this.$router.push({ name: 'receita-editar', params: { id: String(id) } });
    },

    confirmarDelecao(receita: Receita) {
      this.receitaParaDeletar = receita;
    },

    async deletar() {
      if (!this.receitaParaDeletar) return;
      try {
        await receitaService.deletarReceita(this.receitaParaDeletar.id);
        this.receitas = this.receitas.filter(r => r.id !== this.receitaParaDeletar!.id);
        this.receitaParaDeletar = null;
      } catch {
        this.receitaParaDeletar = null;
      }
    },
  },
});
</script>

<style scoped>
.pagina {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.topo h2 {
  font-size: 1.4rem;
  color: var(--cor-texto);
}

.btn-novo {
  text-decoration: none;
  display: inline-block;
  width: auto;
  padding: 0.55rem 1.2rem;
  font-size: 0.9rem;
}

.filtros {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filtros .campo {
  flex: 1;
  min-width: 160px;
  margin-bottom: 0;
}

.btn-buscar {
  width: auto;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  align-self: flex-end;
}

.estado-vazio {
  text-align: center;
  color: var(--cor-texto-suave);
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.estado-vazio a {
  color: var(--cor-primaria);
  font-weight: 600;
}

.lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.card-receita {
  background: #fff;
  border-radius: var(--raio-card);
  box-shadow: var(--sombra-card);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  overflow: hidden;
}

.card-receita:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(109, 40, 217, 0.15);
}

.card-receita-corpo {
  padding: 1.25rem 1.25rem 0.75rem;
}

.tag-categoria {
  display: inline-block;
  font-size: 0.75rem;
  background-color: #ede9f8;
  color: var(--cor-primaria);
  border-radius: 20px;
  padding: 0.2rem 0.65rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-receita-corpo h3 {
  font-size: 1rem;
  color: var(--cor-texto);
  margin-bottom: 0.5rem;
}

.card-receita-info {
  font-size: 0.8rem;
  color: var(--cor-texto-suave);
  display: flex;
  gap: 0.75rem;
}

.card-receita-acoes {
  display: flex;
  border-top: 1px solid #f0eef8;
  padding: 0.6rem 1.25rem;
  gap: 0.5rem;
}

.btn-acao {
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--cor-borda);
  background: none;
  cursor: pointer;
  color: #555;
  transition: background-color 0.15s;
}

.btn-acao:hover {
  background-color: #f5f5f5;
}

.btn-acao-perigo {
  color: var(--cor-erro);
  border-color: #fca5a5;
}

.btn-acao-perigo:hover {
  background-color: #fef2f2;
}

/* modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: var(--raio-card);
  padding: 1.75rem;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: var(--cor-texto);
}

.modal p {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.modal-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secundario {
  padding: 0.6rem 1.25rem;
  border-radius: var(--raio-input);
  border: 1px solid var(--cor-borda);
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
}

.btn-secundario:hover {
  background-color: #f5f5f5;
}

.btn-perigo {
  background-color: var(--cor-erro) !important;
  width: auto;
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
}

.btn-perigo:hover:not(:disabled) {
  background-color: #b91c1c !important;
}

.spinner-escuro {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-top-color: var(--cor-primaria);
  border-radius: 50%;
  animation: girar 0.7s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}
</style>
