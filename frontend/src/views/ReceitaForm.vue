<template>
  <div>
    <Navbar />

    <main class="pagina">
      <div class="topo">
        <button class="btn-voltar" @click="$router.back()">← Voltar</button>
        <h2>{{ editando ? 'Editar receita' : 'Nova receita' }}</h2>
      </div>

      <div class="card form-card">
        <form @submit.prevent="salvar">
          <div class="linha-dupla">
            <div class="campo">
              <label for="nome">Nome da receita</label>
              <input
                id="nome"
                v-model="form.nome"
                type="text"
                placeholder="Ex: Bolo de cenoura"
                :disabled="carregando"
              />
            </div>
            <div class="campo">
              <label for="categoria">Categoria</label>
              <select id="categoria" v-model="form.id_categorias" :disabled="carregando">
                <option :value="null">Sem categoria</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                  {{ cat.nome }}
                </option>
              </select>
            </div>
          </div>

          <div class="linha-dupla">
            <div class="campo">
              <label for="tempo">Tempo de preparo (min)</label>
              <input
                id="tempo"
                v-model.number="form.tempo_preparo_minutos"
                type="number"
                min="1"
                placeholder="Ex: 40"
                :disabled="carregando"
              />
            </div>
            <div class="campo">
              <label for="porcoes">Porções</label>
              <input
                id="porcoes"
                v-model.number="form.porcoes"
                type="number"
                min="1"
                placeholder="Ex: 8"
                :disabled="carregando"
              />
            </div>
          </div>

          <div class="campo">
            <label for="ingredientes">Ingredientes</label>
            <textarea
              id="ingredientes"
              v-model="form.ingredientes"
              placeholder="Liste os ingredientes..."
              rows="4"
              :disabled="carregando"
            />
          </div>

          <div class="campo">
            <label for="modo_preparo">
              Modo de preparo <span class="obrigatorio">*</span>
            </label>
            <textarea
              id="modo_preparo"
              v-model="form.modo_preparo"
              placeholder="Descreva o passo a passo..."
              rows="6"
              :disabled="carregando"
            />
          </div>

          <p class="msg-erro" :style="{ visibility: erro ? 'visible' : 'hidden' }">
            {{ erro || '&nbsp;' }}
          </p>

          <div class="form-acoes">
            <button type="button" class="btn-secundario" @click="$router.back()">
              Cancelar
            </button>
            <button type="submit" class="btn-primario btn-salvar" :disabled="carregando">
              <span v-if="carregando" class="spinner" />
              <span v-else>{{ editando ? 'Salvar alterações' : 'Criar receita' }}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from '@/components/Navbar.vue';
import * as receitaService from '@/services/receita.service';
import { Categoria, ReceitaFormData } from '@/types';

export default Vue.extend({
  name: 'ReceitaFormView',

  components: { Navbar },

  data() {
    return {
      form: {
        nome: '',
        id_categorias: null as number | null,
        tempo_preparo_minutos: null as number | null,
        porcoes: null as number | null,
        modo_preparo: '',
        ingredientes: '',
      } as ReceitaFormData & { nome: string; ingredientes: string },
      categorias: [] as Categoria[],
      erro: '',
      carregando: false,
    };
  },

  computed: {
    editando(): boolean {
      return !!this.$route.params.id;
    },
  },

  async created() {
    this.categorias = await receitaService.listarCategorias();

    if (this.editando) {
      await this.carregarReceita();
    }
  },

  methods: {
    async carregarReceita() {
      try {
        const receita = await receitaService.buscarReceita(Number(this.$route.params.id));
        this.form.nome = receita.nome || '';
        this.form.id_categorias = receita.id_categorias;
        this.form.tempo_preparo_minutos = receita.tempo_preparo_minutos;
        this.form.porcoes = receita.porcoes;
        this.form.modo_preparo = receita.modo_preparo;
        this.form.ingredientes = receita.ingredientes || '';
      } catch {
        this.$router.push({ name: 'receitas' });
      }
    },

    async salvar() {
      this.erro = '';

      if (!this.form.modo_preparo.trim()) {
        this.erro = 'Modo de preparo é obrigatório';
        return;
      }

      this.carregando = true;
      try {
        const dados: ReceitaFormData = {
          nome: this.form.nome || undefined,
          id_categorias: this.form.id_categorias,
          tempo_preparo_minutos: this.form.tempo_preparo_minutos,
          porcoes: this.form.porcoes,
          modo_preparo: this.form.modo_preparo,
          ingredientes: this.form.ingredientes || undefined,
        };

        if (this.editando) {
          await receitaService.atualizarReceita(Number(this.$route.params.id), dados);
        } else {
          await receitaService.criarReceita(dados);
        }

        this.$router.push({ name: 'receitas' });
      } catch (err: any) {
        this.erro = err.response?.data?.erro || 'Não foi possível salvar a receita';
      } finally {
        this.carregando = false;
      }
    },
  },
});
</script>

<style scoped>
.pagina {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.topo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.topo h2 {
  font-size: 1.4rem;
  color: var(--cor-texto);
}

.btn-voltar {
  background: none;
  border: none;
  color: var(--cor-primaria);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}

.form-card {
  max-width: 100%;
}

.linha-dupla {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.obrigatorio {
  color: var(--cor-erro);
}

.form-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-salvar {
  width: auto;
  padding: 0.7rem 1.75rem;
}

.btn-secundario {
  padding: 0.7rem 1.25rem;
  border-radius: var(--raio-input);
  border: 1px solid var(--cor-borda);
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #555;
}

.btn-secundario:hover {
  background-color: #f5f5f5;
}

@media (max-width: 540px) {
  .linha-dupla {
    grid-template-columns: 1fr;
  }
}
</style>
