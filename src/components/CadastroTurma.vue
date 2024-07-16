<template>
  <div>
    <h2 id="tittle">Cadastro Turma</h2>
    <q-form @submit="adicionarTurma" class="q-gutter-md">
      <q-input v-model="nome" label="Nome da Turma" filled lazy-rules :rules="[val => !!val || 'Nome da Turma é obrigatório']"></q-input>
      <q-btn type="submit" label="Adicionar Turma" color="primary" />
    </q-form>

    <h2 id="tittle-2">Turmas Registradas</h2>
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
              <q-btn id="editarTurma" @click="editarTurma(props.row)" class="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></q-btn>
              <q-btn id="excluirTurma" @click="excluirTurma(props.row.turma_id)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></q-btn>
            </template>
            <template v-else>
              <q-btn id="salvarEdicao" @click="salvarEdicao(props.row)" class="waves-effect waves-light btn-small"><i class="material-icons left">save</i></q-btn>
              <q-btn id="cancelarEdicao" @click="cancelarEdicao(props.row)" label="❌" color="negative" />
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
      if (confirm("Tem certeza que deseja excluir esta turma?")) {
        SiadService.deleteTurma(turmaId)
          .then(() => {
            this.carregarTurmas();
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
              alert("Não foi possivel excluir a turma, pois possui alunos cadastrados");
            }
          });
      }
    }
  }
};
</script>

<style scoped>
#tittle {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
#tittle-2 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
#excluirTurma {
  background-color: rgb(210, 81, 81);
}
#editarTurma {
  background-color: rgb(22, 144, 244);
}
#salvarEdicao {
  background-color: rgb(99, 193, 99);
}
#cancelarEdicao {
  background-color: rgb(255, 0, 0);
}
</style>
