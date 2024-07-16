<template>
  <div>
    <h2 id = "tittle-1">Cadastro do Aluno</h2>
    <q-form @submit="aluno.id ? atualizarAluno() : adicionarAluno()" class="q-gutter-md">
      <q-input v-model="aluno.nome" label="Nome do Aluno" filled lazy-rules :rules="[val => !!val || 'Nome do Aluno é obrigatório']"></q-input>
      <q-input v-model="aluno.turma_id" label="ID da Turma" filled lazy-rules :rules="[val => !!val || 'ID da Turma é obrigatório']"></q-input>
      <q-btn type="submit" :label="aluno.id ? 'Salvar Alterações' : 'Adicionar Aluno'" color="primary" />
    </q-form>

    <h2 id = "tittle">Alunos Cadastrados</h2>
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
               <q-btn id="editarAluno" @click="editarAluno(props.row)" class="waves-effect btn-small blue darken-1"><i class="material-icons">create</i></q-btn>
              <q-btn id="excluirAluno" @click="excluirAluno(props.row.aluno_id)" class="waves-effect btn-small red darken-1"><i class="material-icons">delete_sweep</i></q-btn>
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
  name: 'CadastroAluno',
  data() {
    return {
      aluno: {
        nome: '',
        turma_id: null,
        id: null 
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
          window.alert('Erro ao carregar alunos:', error);
        });
    },
    adicionarAluno() {
      if (!this.aluno.nome || !this.aluno.turma_id) {
        window.alert('Nome ou ID da Turma não foram preenchidos');
        return;
      }

      SiadService.addAluno(this.aluno)
        .then(() => {
          console.log('Aluno adicionado com sucesso');
          this.carregarAlunos();
          this.aluno.nome = '';
          this.aluno.turma_id = null;
        })
        .catch(error => {
          window.alert('Erro ao adicionar aluno:', error);
        });
    },
    editarAluno(aluno) {
      aluno.editando = true;
      this.aluno.id = aluno.aluno_id;
    },
    salvarEdicao(aluno) {
       if (confirm("Do u really want do edit ?")){
      if (!aluno.nome_editado || !aluno.turma_id_editado) {
        window.alert('Nome ou ID da Turma editado não foram preenchidos');
        return;
      }

      SiadService.updateAluno(aluno.aluno_id, {
        nome: aluno.nome_editado,
        turma_id: aluno.turma_id_editado
      })
        .then(() => {
          window.alert('Aluno atualizado com sucesso');
          aluno.editando = false;
          aluno.nome = aluno.nome_editado;
          aluno.turma_id = aluno.turma_id_editado;
          this.aluno.id = null;
        })
        .catch(error => {
          window.alert('Erro ao atualizar aluno:', error);
        });
      }
    },
    cancelarEdicao(aluno) {
      aluno.editando = false;
      aluno.nome_editado = aluno.nome;
      aluno.turma_id_editado = aluno.turma_id;
      this.aluno.id = null;
    },
    excluirAluno(aluno_id) {
      if (confirm("Do u really want do delete ?")){
      SiadService.deleteAluno(aluno_id)
        .then(() => {
          this.carregarAlunos();
          if (this.carregarAlunos == false){
            window.alert('Não foi possível excluir o aluno');
          }
        })
        .catch(() => {
          window.alert('O aluno possui notas cadastradas !');
        });
      }
    }
  }
};
</script>

<style scoped>
.q-table{
  background-color: rgb(255, 255, 255);

}
#tittle{
  font-size: 40px;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
#tittle-1{
font-size: 50px;
 font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
#excluirAluno{
  background-color: rgb(255, 0, 0);
}
#editarAluno{
  background-color: rgb(91, 140, 238);
}
#salvarEdicao{
  background-color: rgb(99, 193, 99);
}


</style>
