<template>
  <div class="content-main">
  <div class="logo">
 
  </div>
    <div class="describer-content">
      <h2>
      <strong><br>
      Sistema de Informação de Avaliação de Desempenho</strong>
      </h2>
      <p>
      <strong>
      Sistema Criado para informar e gerenciar o curso de Ciencias da Computação</strong></p>
      <p>Se você deseja cadastrar um aluno novo 🖊️ 🧑<router-link to="/cadastro-aluno">Clique Aqui</router-link></p>
      <p>Se você deseja cadastrar uma disciplina nova 🖊️ 📚<router-link to="/cadastro-disciplina">Clique Aqui</router-link></p>
      <p>Se você deseja cadastrar uma turma nova 🖊️ 🏫<router-link to="/cadastro-turma">Clique Aqui</router-link></p>
      <p>Para adicionar uma nota para um aluno já cadastrado 🖊️ 📑<router-link to ="/cadastro-nota">Clique Aqui</router-link></p>
      <p>Para exportar e visualizar as notas e alunos cadastrados 📎 📁<router-link to ="/situacao-aluno">Clique Aqui</router-link></p>
    </div>
  </div>
    
</template>
 
<script>


export default {
  
  name: 'HomePage'
};
</script>

<style scoped>
.content-main {
  text-align: left;
  margin-top: 2rem;
}

.describer-content h2 {
  font-size: 2rem;
  font-weight: bold;
}
.credits{
  text-align:right;
  margin-top: 30rem;
}
.logo-img{
  height: 40px;
}
.describer-content{
 font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

}
</style>
