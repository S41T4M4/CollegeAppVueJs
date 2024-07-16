<template>
  <div>
    <h2 id="tittle">Tabela de Resultados<br>
    Ciências da Computação
    </h2>
    
    <div class="topnav">
      <input id="searchBar" type="text" placeholder="Procure por um nome ou ID..." v-model="searchQuery">
    </div>
    <table>
      <thead>
        <tr>
          <th class="turma">Turma</th>
          <th class="idAluno">ID do Aluno</th>
          <th class="nomeAluno">Nome do Aluno</th>
          <th v-for="disciplina in disciplinas" :key="disciplina.disciplina_id" class="disciplina">
            {{ disciplina.nome }}
          </th>
          <th class="mediaNotas">Média das Notas</th>
          <th class="status">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in filteredAlunos" :key="aluno.aluno_id" :class="{'reprovado': aluno.media < 6, 'aprovado': aluno.media >= 6, 'naoAvaliado': aluno.media == 0}">
          <td>{{ aluno.turma_nome }}</td>
          <td>{{ aluno.aluno_id }}</td>
          <td>{{ aluno.nome }}</td>
          <td class="disciplinas" v-for="disciplina in disciplinas" :key="disciplina.disciplina_id">
            {{ getNota(aluno, disciplina.disciplina_id) }}
          </td>
          <td>{{ aluno.media.toFixed(2) }}</td>
          <td>{{ aluno.media >= 6 ? 'Aprovado ✔️' : 'Reprovado ❌' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <button id="baixarCsv" @click="downloadCSV" class="waves-effect waves-light btn-small">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
      </svg>
    </button>
  </div>
  <div>
    <p>
      Aluno sem nota ➜
      <router-link to="/cadastro-nota">Cadastre aqui</router-link>
    </p>
  </div>
</template>

<script>
import SiadService from '@/services/SiadService';

export default {
  name: 'MediaNotas',
  data() {
    return {
      alunos: [],
      disciplinas: [],
      searchQuery: ''
    };
  },
  mounted() {
    this.buscarAlunosComMedia();
    this.buscarDisciplinas();
  },
  computed: {
    filteredAlunos() {
      const query = this.searchQuery.toLowerCase();
      return this.alunos.filter(aluno =>
        aluno.turma_nome.toLowerCase().includes(query) ||
        aluno.aluno_id.toString().includes(query) ||
        aluno.nome.toLowerCase().includes(query) ||
        aluno.media.toString().includes(query) ||
        (aluno.media >= 6 ? 'Aprovado' : 'Reprovado').toLowerCase().includes(query)
      );
    }
  },
  methods: {
    buscarAlunosComMedia() {
      SiadService.getAlunos()
        .then(alunosResponse => {
          const alunos = alunosResponse.data;
          const promessas = alunos.map(aluno => {
            return SiadService.getNotasByAluno(aluno.aluno_id)
              .then(notasResponse => {
                return SiadService.getMediaNotasByAluno(aluno.aluno_id)
                  .then(mediaResponse => {
                    return SiadService.getTurmas()
                      .then(turmasResponse => {
                        const turmaDoAluno = turmasResponse.data.find(turma => turma.turma_id === aluno.turma_id);
                        return {
                          ...aluno,
                          notas: notasResponse.data,
                          media: mediaResponse.data,
                          turma_nome: turmaDoAluno ? turmaDoAluno.nome : 'N/A',
                        };
                      });
                  });
              })
              .catch(error => {
                console.error(`Erro ao buscar as notas do aluno ${aluno.nome}:`, error);
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
    buscarDisciplinas() {
      SiadService.getDisciplinas()
        .then(response => {
          this.disciplinas = response.data;
        })
        .catch(error => {
          console.error('Erro ao buscar disciplinas:', error);
        });
    },
    getNota(aluno, disciplinaId) {
      const nota = aluno.notas.find(nota => nota.disciplina_id === disciplinaId);
      return nota ? nota.nota.toFixed(2) : 'N/A';
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
#tittle{
  font-size: 30px;
  font-weight: bold;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #000000;
  padding: 8px;
}
th {
  background-color: #ffffff;
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
  background-color: #8df1f2;
}
.mediaNotas:hover{
  background-color: rgb(238, 239, 192);
}
.status:hover{
  background-color: chartreuse;
}
#tittle {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
#baixarCsv {
  background-color: #00b170; 
  border: none;
  color: rgb(246, 246, 246);
  padding: 6px 18px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100%;
}
#baixarCsv:hover {
  background-color: #0d4c14;
}
#searchBar{
  width: 100%;
  padding: 12px 20px;
}
#searchBar:hover{
  background-color: #e9e9e9;
}
.disciplina:hover{
    background-color: #dffff0;
}
</style>
