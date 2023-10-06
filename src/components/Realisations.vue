<template lang="">
  <div class="cover realisations">
    <h1>Réalisations</h1>
    <div class="grid">
      <Card :item="item" v-for="item in items" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          name: "Jeu de la vie",
          route: "/gameLife",
          image: "/img/gameLife_background.jpg",
          info : "https://youtu.be/S-W0NX97DB0?si=YACFxyMjO-j0DSyE"
        },
        {
          name: "Agenda de La Bibliothèque de Lyon",
          route:
            "https://www.bm-lyon.fr/les-rendez-vous-des-bibliotheques-municipales-de-lyon/#/",
          image: "/img/agenda_background.jpg",
        },
        {
          name: "Fourmi de Langton",
          route: "/langton",
          image: "/img/langton.png",
          info: "https://youtu.be/qZRYGxF6D3w?si=18-VLCSTtvV_WuNS"
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
/*.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5em;
  width: 60%;
}*/
</style>
