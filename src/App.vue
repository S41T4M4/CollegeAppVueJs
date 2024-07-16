<template>
  <div id="app">
    <header class="header" id="myHeader">  
      <button  id="toggleMenu" @click="menuLateral" >☰</button>
       <button id="home-button">
      <router-link to="/" id="nerd-face1">S.I.A.D</router-link>
      </button>
    </header>
    <aside :class="{ open: isMenuOpen }">
      <nav>
        <button @click="toggleMenu" class="close-btn">✕</button>
        <ul >
          <li class="asideMenu"><router-link to="/cadastro-aluno">Cadastro do Aluno</router-link></li>
          <li class="asideMenu"><router-link to="/cadastro-turma">Cadastro da Turma</router-link></li>
          <li class="asideMenu"><router-link to="/cadastro-disciplina">Cadastro da Disciplina</router-link></li>
          <li class="asideMenu"><router-link to="/cadastro-nota">Cadastro de Nota</router-link></li>
          <li class="asideMenu"><router-link to="/situacao-aluno">Situação do Aluno</router-link></li>
          
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
    menuLateral() {
      this.isMenuOpen = !this.isMenuOpen
    }  
  }
};


</script>

<style>

body {
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;
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
  background-color: #000000;
  color: rgb(255, 255, 255);
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
#nerd-face{
 font-size: 24px;
 text-align: center;
}
.header{
  background-color: #000000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  z-index: 200;
  height:60px;
}
#home-button{
 position:absolute;
 left : 50%;
 background-color: #000000;
}
#nerd-face1{
  color:#ffffff;
  font-size: 28px;
  position: absolute;
  font-family: serif;
}
#nerd-face1:hover{
  color:#8c8c8c;
}
#toggleMenu:hover{
  color:#bcfffe;
}
.asideMenu{

  font-size: 18px;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
}
.asideMenu:hover{
  font-style: italic;
}
</style>
