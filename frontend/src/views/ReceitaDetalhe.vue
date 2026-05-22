<template>
  <div>
    <Navbar class="sem-impressao" />

    <main class="pagina">
      <div class="topo sem-impressao">
        <button class="btn-voltar" @click="$router.back()">← Voltar</button>
        <div class="topo-acoes">
          <button class="btn-acao" @click="editar">Editar</button>
          <button class="btn-acao btn-imprimir" @click="imprimir">🖨 Imprimir</button>
        </div>
      </div>

      <div v-if="carregando" class="estado-vazio">
        <span class="spinner-escuro" />
      </div>

      <div v-else-if="receita" class="receita-detalhe">
        <div class="receita-cabecalho">
          <span v-if="receita.categoria_nome" class="tag-categoria">
            {{ receita.categoria_nome }}
          </span>
          <h1>{{ receita.nome || 'Receita sem título' }}</h1>
          <div class="receita-meta">
            <span v-if="receita.tempo_preparo_minutos">
              ⏱ {{ receita.tempo_preparo_minutos }} minutos
            </span>
            <span v-if="receita.porcoes">
              🍽 {{ receita.porcoes }} porções
            </span>
          </div>
        </div>

        <hr class="divisor" />

        <section v-if="receita.ingredientes" class="secao">
          <h2>Ingredientes</h2>
          <p class="texto-pre">{{ receita.ingredientes }}</p>
        </section>

        <section class="secao">
          <h2>Modo de preparo</h2>
          <p class="texto-pre">{{ receita.modo_preparo }}</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Navbar from '@/components/Navbar.vue';
import * as receitaService from '@/services/receita.service';
import { Receita } from '@/types';

export default Vue.extend({
  name: 'ReceitaDetalheView',

  components: { Navbar },

  data() {
    return {
      receita: null as Receita | null,
      carregando: false,
    };
  },

  async created() {
    this.carregando = true;
    try {
      this.receita = await receitaService.buscarReceita(Number(this.$route.params.id));
    } catch {
      this.$router.push({ name: 'receitas' });
    } finally {
      this.carregando = false;
    }
  },

  methods: {
    editar() {
      this.$router.push({ name: 'receita-editar', params: { id: this.$route.params.id } });
    },

    imprimir() {
      window.print();
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
  justify-content: space-between;
  margin-bottom: 1.5rem;
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

.topo-acoes {
  display: flex;
  gap: 0.5rem;
}

.btn-acao {
  font-size: 0.875rem;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--cor-borda);
  background: none;
  cursor: pointer;
  color: #555;
  transition: background-color 0.15s;
}

.btn-acao:hover {
  background-color: #f5f5f5;
}

.btn-imprimir {
  background-color: var(--cor-primaria);
  color: #fff;
  border-color: var(--cor-primaria);
}

.btn-imprimir:hover {
  background-color: var(--cor-primaria-hover) !important;
}

.receita-detalhe {
  background: #fff;
  border-radius: var(--raio-card);
  box-shadow: var(--sombra-card);
  padding: 2rem;
}

.receita-cabecalho {
  margin-bottom: 1.25rem;
}

.tag-categoria {
  display: inline-block;
  font-size: 0.8rem;
  background-color: #ede9f8;
  color: var(--cor-primaria);
  border-radius: 20px;
  padding: 0.2rem 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.receita-cabecalho h1 {
  font-size: 1.75rem;
  color: var(--cor-texto);
  margin-bottom: 0.5rem;
}

.receita-meta {
  display: flex;
  gap: 1.25rem;
  font-size: 0.9rem;
  color: var(--cor-texto-suave);
}

.divisor {
  border: none;
  border-top: 1px solid #f0eef8;
  margin: 1.25rem 0;
}

.secao {
  margin-bottom: 1.75rem;
}

.secao h2 {
  font-size: 1rem;
  color: var(--cor-primaria);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}

.texto-pre {
  white-space: pre-wrap;
  line-height: 1.7;
  color: #444;
  font-size: 0.95rem;
}

.estado-vazio {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.spinner-escuro {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-top-color: var(--cor-primaria);
  border-radius: 50%;
  animation: girar 0.7s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

/* estilos de impressão */
@media print {
  .sem-impressao {
    display: none !important;
  }

  .pagina {
    padding: 0;
  }

  .receita-detalhe {
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
}
</style>
