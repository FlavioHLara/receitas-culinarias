<template>
  <div class="receita-form">
    <h1>{{ editando ? 'Editar receita' : 'Nova receita' }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ReceitaFormView',
  computed: {
    editando(): boolean {
      return !!this.$route.params.id
    },
  },
})
</script>
