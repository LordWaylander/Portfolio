<template>
  <GameLife />
  <main class="main center">
    <div class="center menu">
      <div>
        <h1 class="title">Waylander</h1>
      </div>
      <span></span>
      <div>
        <h2 class="subTitle">Développeur Web - Full Stack</h2>
      </div>

      <RouterLink to="/presentation" class="activeClass linkDiscoverMe">
        <button>Me Découvrir</button>
      </RouterLink>
    </div>
  </main>
</template>
<script setup>
import { RouterLink } from "vue-router";
import GameLife from "../components/GameLife.vue"; // init : 76, play : 161.1 ms
import GameLife_patate from "../components/GameLife_patate.vue"; // init : 86, play : 125.7 ms
import GameLife_jerome from "../components/GameLife_jerome.vue";
</script>
<style lang="scss" scoped>
.menu {
  background-color: var(--color-background-soft);
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
    font-family: unifont;
    font-size: 4em;
  }
  span {
    height: 10px;
    background: #3f454d;
    width: 75%;
    margin: 2em 0 2em 0;
    border-radius: 2em;
  }
  a {
    width: 25%;
    position: relative;
    top: 10%;

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
</style>
