<template>
  <div>
    <h2 id="tittle">Class Registration</h2>
    <q-form @submit="adicionarTurma" class="q-gutter-md">
      <q-input v-model="nome" label="Nome da Turma" filled lazy-rules :rules="[val => !!val || 'Nome da Turma é obrigatório']"></q-input>
      <q-btn type="submit" label="Adicionar Turma" color="primary" />
    </q-form>

    
    <h2 id = "tittle-2">Registered Classes</h2>
    <q-table
      class="q-table"
      :rows="turmas"
      :columns="columns"
      row-key="turma_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:top-right>

      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="turma_id" :props="props">{{ props.row.turma_id }}</q-td>
          <q-td key="nome" :props="props">
            <template v-if="!props.row.editando">
              {{ props.row.nome }}
            </template>
            <template v-else>
              <q-input v-model="props.row.nome_editado" label="Novo Nome" filled lazy-rules :rules="[val => !!val || 'Nome da Turma é obrigatório']"></q-input>
            </template>
          </q-td>
          <q-td key="acoes" :props="props">
            <template v-if="!props.row.editando">
              <q-btn @click="editarTurma(props.row)" label="Editar" color="primary" />
              <q-btn @click="excluirTurma(props.row.turma_id)" label="Excluir" color="negative" />
            </template>
            <template v-else>
              <q-btn @click="salvarEdicao(props.row)" label="Salvar" color="green" />
              <q-btn @click="cancelarEdicao(props.row)" label="Cancelar" color="negative" />
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import SiadService from '@/services/SiadService';

export default {
  name: 'CadastroTurma',
  data() {
    return {
      turmas: [],
      nome: '',
      columns: [
        { name: 'turma_id', label: 'ID', align: 'left', field: 'turma_id' },
        { name: 'nome', label: 'Nome da Turma', align: 'left', field: 'nome' },
        { name: 'acoes', label: 'Ações', align: 'center' }
      ]
    };
  },
  mounted() {
    this.carregarTurmas();
  },
  methods: {
    carregarTurmas() {
      SiadService.getTurmas()
        .then(response => {
          this.turmas = response.data.map(turma => ({
            ...turma,
            editando: false,
            nome_editado: turma.nome
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar turmas:', error);
        });
    },
    adicionarTurma() {
      SiadService.addTurma({ nome: this.nome })
        .then(() => {
          this.nome = '';
          this.carregarTurmas();
        })
        .catch(error => {
          console.error('Erro ao adicionar turma:', error);
        });
    },
    editarTurma(turma) {
      turma.editando = true;
    },
    salvarEdicao(turma) {
      SiadService.updateTurma(turma.turma_id, { nome: turma.nome_editado })
        .then(() => {
          turma.editando = false;
          turma.nome = turma.nome_editado;
        })
        .catch(error => {
          console.error('Erro ao atualizar turma:', error);
        });
    },
    cancelarEdicao(turma) {
      turma.editando = false;
      turma.nome_editado = turma.nome;
    },
    excluirTurma(turmaId) {
      if (confirm("Are u sure about that ?")) {
      SiadService.deleteTurma(turmaId)
        .then(() => {
          this.carregarTurmas();
        })
        .catch(() => {
          window.alert('Não é possivel excluir uma turma com alunos !');
        });
      }
    }
  }
};
</script>

<style scoped>
#tittle{
    font-family: serif;
}
#tittle-2{
    font-family: serif;
}
</style>
