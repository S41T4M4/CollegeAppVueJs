import axios from 'axios';

const http = axios.create({
  baseURL: 'https://localhost:7172/api/v1/siad',
  headers: {
    'Content-Type': 'application/json'
  }
});

const SiadService = {
 
  getTurmas() {
    return http.get('/turmas');
  },
  addTurma(turma) {
    return http.post('/turmas', turma);
  },
  updateTurma(turma_id, turma) {
    return http.put(`/turmas/${turma_id}`, turma);
  },
  deleteTurma(turma_id) {
    return http.delete(`/turmas/${turma_id}`);
  },

 
  getAlunos() {
    return http.get('/alunos');
  },
  addAluno(aluno) {
    return http.post('/alunos', aluno);
  },
  updateAluno(aluno_id, aluno) {
    return http.put(`/alunos/${aluno_id}`, aluno);
  },
  deleteAluno(aluno_id) {
    return http.delete(`/alunos/${aluno_id}`);
  },


  getDisciplinas() {
    return http.get('/disciplinas');
  },
  addDisciplina(disciplina) {
  return http.post('/disciplinas', disciplina)
    .then(response => {
      console.log('Disciplina adicionada com sucesso:', response.data);
      return response.data;  
    })
    .catch(error => {
      console.error('Erro ao adicionar disciplina:', error);
      throw error;  
    });
},

  updateDisciplina(disciplina_id, disciplina) {
    return http.put(`/disciplinas/${disciplina_id}`, disciplina);
  },
  deleteDisciplina(disciplina_id) {
    return http.delete(`/disciplinas/${disciplina_id}`);
  },

  getNotas() {
    return http.get('/notas');
  },
  addNota(nota) {
    return http.post('/notas', nota);
  },
  updateNota(nota_id, nota) {
    return http.put(`/notas/${nota_id}`, nota);
  },
  deleteNota(nota_id) {
    return http.delete(`/notas/${nota_id}`);
  },


  getTurmasAlunosDisciplinasNotas() {
    return http.get('/turmas-alunos-disciplinas-notas');
  }
};

export default SiadService;

