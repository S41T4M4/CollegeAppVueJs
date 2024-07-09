<template>
  <div>
    <h2>Cadastro do Aluno</h2>
    <q-form @submit="aluno.id ? atualizarAluno() : adicionarAluno()" class="q-gutter-md">
      <q-input v-model="aluno.nome" label="Nome do Aluno" filled lazy-rules :rules="[val => !!val || 'Nome do Aluno é obrigatório']"></q-input>
      <q-input v-model="aluno.turma_id" label="ID da Turma" filled lazy-rules :rules="[val => !!val || 'ID da Turma é obrigatório']"></q-input>
      <q-btn type="submit" :label="aluno.id ? 'Salvar Alterações' : 'Adicionar Aluno'" color="primary" />
    </q-form>

    <h2>Alunos Cadastrados</h2>
    <q-table
      class="q-table"
      :rows="alunos"
      :columns="columns"
      row-key="aluno_id"
      :pagination="false"
      :rows-per-page-options="[]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="nome" :props="props">
            <template v-if="!props.row.editando">
              {{ props.row.nome }}
            </template>
            <template v-else>
              <q-input v-model="props.row.nome_editado" label="Novo Nome" filled lazy-rules :rules="[val => !!val || 'Nome do Aluno é obrigatório']"></q-input>
            </template>
          </q-td>
          <q-td key="turma_id" :props="props">
            <template v-if="!props.row.editando">
              {{ props.row.turma_id }}
            </template>
            <template v-else>
              <q-input v-model="props.row.turma_id_editado" label="Novo ID da Turma" filled lazy-rules :rules="[val => !!val || 'ID da Turma é obrigatório']"></q-input>
            </template>
          </q-td>
          <q-td key="acoes" :props="props">
            <template v-if="!props.row.editando">
              <q-btn @click="editarAluno(props.row)" label="Editar" color="primary" />
              <q-btn @click="excluirAluno(props.row.aluno_id)" label="Excluir" color="negative" />
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
  name: 'CadastroAluno',
  data() {
    return {
      aluno: {
        nome: '',
        turma_id: null,
        id: null // Adicionei este campo para diferenciar entre adicionar e atualizar aluno
      },
      alunos: [],
      columns: [
        { name: 'nome', label: 'Nome do Aluno', align: 'left', field: 'nome' },
        { name: 'turma_id', label: 'ID da Turma', align: 'left', field: 'turma_id' },
        { name: 'acoes', label: 'Ações', align: 'center' }
      ]
    };
  },
  mounted() {
    this.carregarAlunos();
  },
  methods: {
    carregarAlunos() {
      SiadService.getAlunos()
        .then(response => {
          this.alunos = response.data.map(aluno => ({
            ...aluno,
            editando: false,
            nome_editado: aluno.nome,
            turma_id_editado: aluno.turma_id
          }));
        })
        .catch(error => {
          console.error('Erro ao carregar alunos:', error);
        });
    },
    adicionarAluno() {
      if (!this.aluno.nome || !this.aluno.turma_id) {
        console.error('Nome ou ID da Turma não foram preenchidos');
        return;
      }

      SiadService.addAluno(this.aluno)
        .then(() => {
          console.log('Aluno adicionado com sucesso');
          this.aluno.nome = '';
          this.aluno.turma_id = null;
          this.carregarAlunos();
        })
        .catch(error => {
          console.error('Erro ao adicionar aluno:', error);
        });
    },
    editarAluno(aluno) {
      aluno.editando = true;
      this.aluno.id = aluno.aluno_id;
    },
    salvarEdicao(aluno) {
      if (!aluno.nome_editado || !aluno.turma_id_editado) {
        console.error('Nome ou ID da Turma editado não foram preenchidos');
        return;
      }

      SiadService.updateAluno(aluno.aluno_id, {
        nome: aluno.nome_editado,
        turma_id: aluno.turma_id_editado
      })
        .then(() => {
          console.log('Aluno atualizado com sucesso');
          aluno.editando = false;
          aluno.nome = aluno.nome_editado;
          aluno.turma_id = aluno.turma_id_editado;
          this.aluno.id = null;
        })
        .catch(error => {
          console.error('Erro ao atualizar aluno:', error);
        });
    },
    cancelarEdicao(aluno) {
      aluno.editando = false;
      aluno.nome_editado = aluno.nome;
      aluno.turma_id_editado = aluno.turma_id;
      this.aluno.id = null;
    },
    excluirAluno(aluno_id) {
      SiadService.deleteAluno(aluno_id)
        .then(() => {
          console.log('Aluno excluído com sucesso');
          this.carregarAlunos();
        })
        .catch(error => {
          console.error('Erro ao excluir aluno:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Seu CSS aqui */
</style>
