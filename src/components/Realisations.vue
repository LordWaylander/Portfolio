<template lang="">
  <div class="cover">
    <h1>Réalisations</h1>
    <div class="grid">
      <Card :item="item" v-for="item in items" />
    </div>
  </div>
</template>
<script setup>
import Card from "./Card.vue";
</script>
<script>
export default {
  data() {
    return {
      items: [
        {
          name: "Jeu de la vie",
          route: "/gameLife",
          image: "/img/gameLife_background.jpg",
        },
        {
          name: "Agenda de La Bibliothèque de Lyon",
          route:
            "https://www.bm-lyon.fr/les-rendez-vous-des-bibliotheques-municipales-de-lyon/#/",
          image: "/img/agenda_background.jpg",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5em;
  width: 60%;
}
</style>
