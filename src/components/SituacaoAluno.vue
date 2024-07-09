<template>
  <div>
    <h2>Situação do Aluno</h2>
    <p v-if="notas.length > 0">
      Média de Notas: {{ calcularMediaNotas().toFixed(2) }}
    </p>
    <p v-else>
      Nenhuma nota encontrada para este aluno.
    </p>
  </div>
</template>

<script>
import SiadService from '@/services/SiadService';

export default {
  name: 'SituacaoAluno',

  data() {
    return {
      notas: []
    };
  },

  mounted() {
    this.buscarNotasAluno();
  },

  methods: {
    buscarNotasAluno() {
      const aluno_id = this.$route.params.id; // Supondo que o ID do aluno seja obtido dos parâmetros da rota

      SiadService.getNotas()
        .then(response => {
          // Filtrar as notas apenas para o aluno específico
          this.notas = response.data.filter(nota => nota.aluno_id === aluno_id);
        })
        .catch(error => {
          console.error('Erro ao buscar notas do aluno:', error);
        });
    },

    calcularMediaNotas() {
      if (this.notas.length === 0) return 0;

      // Calcular a média das notas
      const somaNotas = this.notas.reduce((acc, nota) => acc + parseFloat(nota.nota), 0);
      return somaNotas / this.notas.length;
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para o componente */
</style>
