import { createRouter, createWebHistory } from 'vue-router';

import CadastroAluno from './components/CadastroAluno.vue';
import CadastroTurma from './components/CadastroTurma.vue';
import CadastroDisciplina from './components/CadastroDisciplina.vue';
import CadastroNota from './components/CadastroNota.vue';
import SituacaoAluno from './components/SituacaoAluno.vue';
import HomePage from './components/HomePage.vue'; // Import the renamed Home component

const routes = [
  { path: '/', component: HomePage },
  {
    path: '/cadastro-aluno',
    name: 'CadastroAluno',
    component: CadastroAluno
  },
  {
    path: '/cadastro-turma',
    name: 'CadastroTurma',
    component: CadastroTurma
  },
  {
    path: '/cadastro-disciplina',
    name: 'CadastroDisciplina',
    component: CadastroDisciplina
  },
  {
    path: '/cadastro-nota',
    name: 'CadastroNota',
    component: CadastroNota
  },
  {
    path: '/situacao-aluno',
    name: 'SituacaoAluno',
    component: SituacaoAluno
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
