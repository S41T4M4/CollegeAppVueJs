<template>
  <div>
    <h2>Cadastro de Disciplina</h2>

    <q-form @submit="adicionarDisciplina" class="q-gutter-md">
      <q-input v-model="nome" label="Nome da Disciplina" filled lazy-rules :rules="[val => !!val || 'Nome da Disciplina é obrigatório']"></q-input>
      <q-btn type="submit" label="Adicionar Disciplina" color="primary" />
    </q-form>

    <h2>Disciplinas Cadastradas</h2>
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
              <q-btn @click="editarDisciplina(props.row)" label="Editar" color="primary" />
              <q-btn @click="excluirDisciplina(props.row.disciplina_id)" label="Excluir" color="negative" />
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
      disciplina.nome_editado = disciplina.nome;
    },
    excluirDisciplina(disciplinaId) {
      SiadService.deleteDisciplina(disciplinaId)
        .then(() => {
          this.carregarDisciplinas();
        })
        .catch(error => {
          console.error('Erro ao excluir disciplina:', error);
        });
    }
  }
};
</script>

<style scoped>

</style>
