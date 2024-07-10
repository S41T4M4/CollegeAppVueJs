<template>
  <div>
    <h2>Média das Notas dos Alunos</h2>

    <!-- Botão de Download CSV -->
    <button @click="downloadCSV" class="download-btn">Baixar CSV</button>

    <table>
      <thead>
        <tr>
          <th>Turma</th>
          <th>ID do Aluno</th>
          <th>Nome do Aluno</th>
          <th>Média das Notas</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.aluno_id">
          <td>{{ aluno.turma_nome }}</td>
          <td>{{ aluno.aluno_id }}</td>
          <td>{{ aluno.nome }}</td>
          <td>{{ aluno.media.toFixed(2) }}</td>
          <td>{{ aluno.media >= 6 ? 'Aprovado' : 'Reprovado' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SiadService from '@/services/SiadService';

export default {
  name: 'MediaNotas',
  data() {
    return {
      alunos: []
    };
  },
  mounted() {
    this.buscarAlunosComMedia();
  },
  methods: {
    buscarAlunosComMedia() {
      SiadService.getAlunos()
        .then(alunosResponse => {
          const alunos = alunosResponse.data;

          const promessas = alunos.map(aluno => {
            return SiadService.getMediaNotasByAluno(aluno.aluno_id)
              .then(mediaResponse => {
                return SiadService.getTurmas()
                  .then(turmasResponse => {
                    const turmaDoAluno = turmasResponse.data.find(turma => turma.turma_id === aluno.turma_id);
                    return {
                      ...aluno,
                      media: mediaResponse.data,
                      turma_nome: turmaDoAluno ? turmaDoAluno.nome : 'N/A'
                    };
                  });
              })
              .catch(error => {
                console.error(`Erro ao buscar a média das notas do aluno ${aluno.nome}:`, error);
                return {
                  ...aluno,
                  media: 0,
                  turma_nome: 'N/A'
                };
              });
          });

          return Promise.all(promessas);
        })
        .then(resultados => {
          this.alunos = resultados;
        })
        .catch(error => {
          console.error('Erro ao buscar os alunos:', error);
        });
    },

    downloadCSV() {
      SiadService.downloadMediaNotasCSV()
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'media_notas.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Erro ao baixar o arquivo CSV:', error);
          alert('Erro ao baixar o arquivo CSV. Verifique o console para mais detalhes.');
        });
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
  text-align: left;
}
.download-btn {
  margin-bottom: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}
.download-btn:hover {
  background-color: #0056b3;
}
</style>
