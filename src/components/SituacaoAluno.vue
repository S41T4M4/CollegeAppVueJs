<template>
  <div>
    <h2>Média das Notas dos Alunos</h2>


    <button @click="downloadCSV" class="download-btn">Baixar CSV</button>

    <table>
      <thead>
        <tr>
          <th class="turma">Turma</th>
          <th class="idAluno">ID do Aluno</th>
          <th class="nomeAluno">Nome do Aluno</th>
          <th class="mediaNotas">Média das Notas</th>
          <th class="status">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.aluno_id">
          <td class="turma">{{ aluno.turma_nome }}</td>
          <td class="idAluno">{{ aluno.aluno_id }}</td>
          <td class="nomeAluno">{{ aluno.nome }}</td>
          <td class="mediaNotas">{{ aluno.media.toFixed(2) }}</td>
          <td class="status">{{ aluno.media >= 6 ? 'Aprovado' : 'Reprovado' }}</td>
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
        .then(blob => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Download_Alunos_Notas.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error('Erro ao baixar o CSV:', error);
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
.turma:hover{
  background-color: #aed9f5;
}
.idAluno:hover{
  background-color: #dcaef5;
}
.nomeAluno:hover{
  background-color: #f5a9a9;
}
.mediaNotas:hover{
background-color: rgb(251, 252, 186);
}
.status:hover{
background-color: chartreuse;
}
</style>
