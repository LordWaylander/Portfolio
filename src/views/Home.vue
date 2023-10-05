<template>
  <main class="fullPage center">
    <div class="center menu">
      <div>
        <h1 class="title">François Caizes</h1>
      </div>
      <span></span>
      <div>
        <h2 class="subTitle">Développeur Web - Full Stack</h2>
      </div>

      <RouterLink to="/aboutMe" class="activeClass linkDiscoverMe">
        <button>Me Découvrir</button>
      </RouterLink>
    </div>
  </main>
</template>
<style lang="scss" scoped>
/*.menu {
  background-color: var(--grey);
  width: 75vw;
  min-height: 50vh;
  padding: 2em 0 2em 0;
  flex-direction: column;
  border-radius: 5em;
  z-index: 10;
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
    margin-top: 1em;

    button {
      background-color: var(--grey-light);
      box-shadow:
        0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      border: none;
      width: 100%;
      padding: 1em;
      border-radius: 1em;
      color: var(--primary-text);
      font-size: 1.25em;
      text-decoration: none;
      cursor: pointer;
    }
  }
}*/
</style>
