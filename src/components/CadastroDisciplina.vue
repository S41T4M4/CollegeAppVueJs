<template>
  <link href="https://fonts.googleapis.com/css?family=Poppins:600" rel="stylesheet">
  <div>
    <h2 id="tittle-1">Cadastro de Disciplina</h2>

    <q-form @submit="adicionarDisciplina" class="q-gutter-md">
      <q-input v-model="nome" label="Nome da Disciplina" filled lazy-rules :rules="[val => !!val || 'Nome da Disciplina é obrigatório']"></q-input>
      <q-btn type="submit" label="Adicionar Disciplina" color="primary" />
    </q-form>

    <h2 id="tittle-2">Disciplinas Cadastradas</h2>
    <q-table
      class="q-table"
      :rows="disciplinas"
      :columns="columns"
      row-key="disciplina_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:top-right>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="disciplina_id" :props="props">{{ props.row.disciplina_id }}</q-td>
          <q-td key="nome" :props="props">
            <template v-if="!props.row.editando">
              {{ props.row.nome }}
            </template>
            <template v-else>
              <q-input v-model="props.row.nome_editado" label="Novo Nome" filled lazy-rules :rules="[val => !!val || 'Nome da Disciplina é obrigatório']"></q-input>
            </template>
          </q-td>
          <q-td key="acoes" :props="props">
            <template v-if="!props.row.editando">
              <q-btn id="editarDisciplina" @click="editarDisciplina(props.row)" lass="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></q-btn>
              <q-btn id="excluirDisciplina" @click="excluirDisciplina(props.row.disciplina_id)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></q-btn>
            </template>
            <template v-else>
              <q-btn id="salvarEdicao" @click="salvarEdicao(props.row)" class="waves-effect waves-light btn-small"><i class="material-icons left">save</i></q-btn>
              <q-btn @click="cancelarEdicao(props.row)" label="❌" color="negative" />
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
  name: 'CadastroDisciplina',
  data() {
    return {
      disciplinas: [],
      nome: '',
      disciplinaId: '',
      columns: [
        { name: 'disciplina_id', label: 'ID', align: 'left', field: 'disciplina_id' },
        { name: 'nome', label: 'Nome da Disciplina', align: 'left', field: 'nome' },
        { name: 'acoes', label: 'Ações', align: 'center' }
      ]
    };
  },
  mounted() {
    this.carregarDisciplinas();
  },
  methods: {
    carregarDisciplinas() {
      SiadService.getDisciplinas()
        .then(response => {
          this.disciplinas = response.data.map(disciplina => ({
            ...disciplina,
            editando: false,
            nome_editado: disciplina.nome
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar disciplinas:', error);
        });
    },
    adicionarDisciplina() {
      const disciplina = {
        nome: this.nome,
        disciplina_id: this.disciplinaId
      };
      SiadService.addDisciplina(disciplina)
        .then(() => {
          this.nome = '';
          this.disciplinaId = '';
          this.carregarDisciplinas();
          this.handleSubmitButton();
        })
        .catch(error => {
          console.error('Erro ao adicionar disciplina:', error);
        });
    },
    editarDisciplina(disciplina) {
      disciplina.editando = true;
    },
    salvarEdicao(disciplina) {
      SiadService.updateDisciplina(disciplina.disciplina_id, { nome: disciplina.nome_editado })
        .then(() => {
          disciplina.editando = false;
          disciplina.nome = disciplina.nome_editado;
        })
        .catch(error => {
          console.error('Erro ao atualizar disciplina:', error);
        });
    },
    cancelarEdicao(disciplina) {
      disciplina.editando = false;

    },
    excluirDisciplina(disciplinaId) {
      if (confirm("Are u sure about that ?")) {
      SiadService.deleteDisciplina(disciplinaId)
        .then(() => {
          this.carregarDisciplinas();
        })
        .catch(error => {
          if(error.response && error.response.data && error.response.data.message){
            alert("Não foi possuivel excluir a disciplina"); 
          }
        });
       }
    },
    handleSubmitButton() {
      const btn = this.$refs.btn;
      btn.setAttribute('class', 'submit process');
      btn.innerHTML = 'Processing';
      setTimeout(() => {
        btn.setAttribute('class', 'submit submitted');
        btn.innerHTML = `
          <span class="tick">&#10004;</span>
          Submitted
        `;
      }, 5000);
    }
  }
};
</script>

<style scoped>
#tittle-1{
    font-family: serif;
}
#tittle-2{
    font-family: serif;
}
#editarDisciplina{
  background-color: rgb(22, 144, 244);
}
#excluirDisciplina{
  background-color: rgb(210, 81, 81);
}
#excluirDisciplina:hover{
  background-color: rgb(203, 13, 13);
}
#salvarEdicao{
  background-color: rgb(59, 176, 65);
}
</style>
