<template lang="">
  <main>
    <section class="three-4page">
      <Presentation />
    </section>
    <section class="three-4page">
      <Realisations />
    </section>
    <section class="three-4page">
      <Experiences />
    </section>
    <section class="three-4page">
      <SavoirFaire />
    </section>
    <footer class="cover footer">
      <p>2023 François CAIZES</p>
    </footer>
  </main>
</template>
<script setup>
import Presentation from "../components/Presentation.vue";
import Realisations from "../components/Realisations.vue";
import Experiences from "../components/Experiences.vue";
import SavoirFaire from "../components/SavoirFaire.vue";
</script>
<style lang="scss" scoped>
section {
  display: flex;
  align-items: center;
}
</style>
