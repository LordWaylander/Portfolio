<template>
  <GameLife />
  <main class="main center">
    <div class="center menu">
      <div>
        <h1>Waylander</h1>
      </div>
      <span></span>
      <div>
        <h2>Développeur Web - Full Stack</h2>
      </div>

      <RouterLink to="/presentation" class="activeClass">
        <button>Me Découvrir</button>
      </RouterLink>
    </div>
  </main>
</template>
<script setup>
import { RouterLink } from "vue-router";
import GameLife from "../components/GameLife.vue";
</script>
<style lang="scss" scoped>
.menu {
  width: 75vw;
  height: 50vh;
  flex-direction: column;
  border-radius: 5em;
  z-index: 999999;
  h1 {
    font-family: UKIJRu;
    font-size: 5em;
  }
  h2 {
    font-family: UKIJMoyQ;
    font-size: 5em;
  }
  span {
    height: 10px;
    background: #3f454d;
    width: 75%;
    margin: 2em 0 2em 0;
    border-radius: 2em;
  }
  a {
    margin-top: 4em;
    margin-bottom: -4em;
    width: 25%;

    button {
      background-color: var(--grey-light);
      box-shadow:
        0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border: none;
      width: 100%;
      padding: 1em;
      border-radius: 1em;
      color: var(--color-text);
      font-size: 1.25em;
      text-decoration: none;
      cursor: pointer;
    }
  }
}
@media (max-width: 910px) {
  h1,
  h2 {
    text-align: center;
  }
}
</style>
