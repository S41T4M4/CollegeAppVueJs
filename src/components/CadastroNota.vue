<template>
  <div>
    <!-- Tabela de Disciplinas -->
    <h2>Disciplinas Cadastradas</h2>
    <q-table
      class="q-table"
      :rows="disciplinas"
      :columns="disciplinaColumns"
      row-key="disciplina_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="disciplina_id" :props="props">{{ props.row.disciplina_id }}</q-td>
          <q-td key="disciplina_nome" :props="props">{{ props.row.nome }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Tabela de Alunos -->
    <h2>Alunos Cadastrados</h2>
    <q-table
      class="q-table"
      :rows="alunos"
      :columns="alunoColumns"
      row-key="aluno_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="aluno_id" :props="props">{{ props.row.aluno_id }}</q-td>
          <q-td key="aluno_nome" :props="props">{{ props.row.nome }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Formulário de Cadastro de Notas -->
    <h2>Cadastro de Notas</h2>
    <q-form @submit="submitForm" class="q-gutter-md">
      <q-input v-model="nota.aluno_id" label="ID do Aluno" filled lazy-rules :rules="[val => !!val || 'ID do Aluno é obrigatório']"></q-input>
      <q-input v-model="nota.disciplina_id" label="ID da Disciplina" filled lazy-rules :rules="[val => !!val || 'ID da Disciplina é obrigatório']"></q-input>
      <q-input v-model="nota.nota" label="Nota" filled lazy-rules :rules="[val => !!val || 'Nota é obrigatória']"></q-input>
      <q-btn type="submit" :label="modoEdicao ? 'Salvar Nota' : 'Adicionar Nota'" :color="modoEdicao ? 'green' : 'primary'" />
    </q-form>

    <!-- Tabela de Notas Cadastradas -->
    <h2>Notas Cadastradas</h2>
    <q-table
      class="q-table"
      :rows="notas"
      :columns="columns"
      row-key="nota_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="aluno_nome" :props="props">{{ getAlunoNome(props.row.aluno_id) }}</q-td>
          <q-td key="disciplina_nome" :props="props">{{ getDisciplinaNome(props.row.disciplina_id) }}</q-td>
          <q-td key="nota" :props="props">{{ props.row.nota }}</q-td>
          <q-td key="acoes" :props="props">
            <q-btn @click="editarNota(props.row)" label="Editar" color="primary" />
            <q-btn @click="excluirNota(props.row.nota_id)" label="Excluir" color="negative" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import SiadService from '@/services/SiadService';

export default {
  name: 'CadastroNotas',
  data() {
    return {
      notas: [],
      alunos: [],
      disciplinas: [],
      nota: {
        aluno_id: '',
        disciplina_id: '',
        nota: ''
      },
      modoEdicao: false,
      columns: [
        { name: 'aluno_nome', label: 'Nome do Aluno', align: 'left', field: 'aluno_nome' },
        { name: 'disciplina_nome', label: 'Nome da Disciplina', align: 'left', field: 'disciplina_nome' },
        { name: 'nota', label: 'Nota', align: 'left', field: 'nota' },
        { name: 'acoes', label: 'Ações', align: 'center' }
      ],
      alunoColumns: [
        { name: 'aluno_id', label: 'ID do Aluno', align: 'left', field: 'aluno_id' },
        { name: 'aluno_nome', label: 'Nome do Aluno', align: 'left', field: 'nome' }
      ],
      disciplinaColumns: [
        { name: 'disciplina_id', label: 'ID da Disciplina', align: 'left', field: 'disciplina_id' },
        { name: 'disciplina_nome', label: 'Nome da Disciplina', align: 'left', field: 'nome' }
      ]
    };
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      Promise.all([
        SiadService.getNotas(),
        SiadService.getAlunos(),
        SiadService.getDisciplinas()
      ])
      .then(([notasResponse, alunosResponse, disciplinasResponse]) => {
        this.notas = notasResponse.data;
        this.alunos = alunosResponse.data;
        this.disciplinas = disciplinasResponse.data;
      })
      .catch(error => {
        console.error('Erro ao carregar dados:', error);
      });
    },
    getAlunoNome(aluno_id) {
      const aluno = this.alunos.find(a => a.aluno_id === aluno_id);
      return aluno ? aluno.nome : 'Desconhecido';
    },
    getDisciplinaNome(disciplina_id) {
      const disciplina = this.disciplinas.find(d => d.disciplina_id === disciplina_id);
      return disciplina ? disciplina.nome : 'Desconhecido';
    },
    submitForm() {
      if (this.modoEdicao) {
        this.atualizarNota();
      } else {
        this.adicionarNota();
      }
    },
    adicionarNota() {
      SiadService.addNota(this.nota)
        .then(() => {
          this.limparFormulario();
          this.carregarDados();
        })
        .catch(error => {
          console.error('Erro ao adicionar nota:', error);
        });
    },
    editarNota(nota) {
      this.nota = { ...nota };
      this.modoEdicao = true;
    },
    atualizarNota() {
      SiadService.updateNota(this.nota.nota_id, this.nota)
        .then(() => {
          this.limparFormulario();
          this.carregarDados();
        })
        .catch(error => {
          console.error('Erro ao atualizar nota:', error);
        });
    },
    excluirNota(nota_id) {
      SiadService.deleteNota(nota_id)
        .then(() => {
          this.carregarDados();
        })
        .catch(error => {
          console.error('Erro ao excluir nota:', error);
        });
    },
    limparFormulario() {
      this.nota = {
        aluno_id: '',
        disciplina_id: '',
        nota: ''
      };
      this.modoEdicao = false;
    }
  }
};
</script>

<style scoped>

</style>
