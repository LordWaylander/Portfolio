<template lang="">
  <nav>
    <RouterLink to="/" active-class="nav-active" class="button">
      Home
    </RouterLink>
    <RouterLink to="/presentation" active-class="nav-active" class="button">
      Presentation
    </RouterLink>
  </nav>
</template>
<script>
import { RouterLink } from "vue-router";
export default {};
</script>
<style lang="scss">
.nav-active {
  background-color: aqua;
}
</style>
