<template>
  <div id="app">
    <header>
       
      <button @click="toggleMenu">☰ Menu</button>
    </header>

    <aside :class="{ open: isMenuOpen }">
      <nav>
        <button @click="toggleMenu" class="close-btn">✕</button>
        <ul>
          <li><router-link to="/cadastro-aluno">Cadastro do Aluno</router-link></li>
          <li><router-link to="/cadastro-turma">Cadastro da Turma</router-link></li>
          <li><router-link to="/cadastro-disciplina">Cadastro da Disciplina</router-link></li>
          <li><router-link to="/cadastro-nota">Cadastro de Nota</router-link></li>
          <li><router-link to="/situacao-aluno">Situação do Aluno</router-link></li>
        </ul>
      </nav>
    </aside>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import router from './router';

export default {
  name: 'App',
  router,
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }
};
</script>

<style>

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: left;
}

header button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: #333;
  color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

aside.open {
  transform: translateX(0);
}

aside nav {
  display: flex;
  flex-direction: column;
  height: 100%;
}

aside nav .close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  align-self: flex-end;
  cursor: pointer;
  margin: 1rem;
}

aside nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

aside nav ul li {
  padding: 1rem;
  border-bottom: 1px solid #444;
}

aside nav ul li a {
  color: white;
  text-decoration: none;
}

main {
  margin-left: 0;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

aside.open + main {
  margin-left: 250px;
}
</style>
