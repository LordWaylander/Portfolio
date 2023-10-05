<template lang="">
  <div class="cover experience">
    <h1>Expériences</h1>
    <v-timeline :density="density" line-color="grey" side="end" align="start">
      <v-timeline-item
        dot-color="#A9A9A9"
        min-height="10em"
        width="100%"
        v-for="experience in experiences"
      >
        <template v-slot:opposite>
          <div class="img">
            <img :src="experience.image" alt="logo du lieu du travail" />
          </div>
        </template>
        <h3 class="text-h6">{{ experience.lieu }}</h3>
        <p>
          {{ experience.job }}
        </p>
        <p>
          {{ experience.date }}
        </p>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      density: "default",
      experiences: [
        {
          lieu: "Bibliothèque Municipale de Lyon",
          image: "/img/jobs/bml.png",
          job: "Développeur Web Full-Stack",
          date: "Octobre 2022",
        },
        {
          lieu: "CGI",
          image: "/img/jobs/cgi.svg",
          job: "Analyste",
          date: "Mars / Aout 2022",
        },
        {
          lieu: "Centre Militaire de Formation Profesionnelle",
          image: "/img/jobs/cmfp.png",
          job: "Titre professionnel (niveau 5), développeur Web",
          date: "Juin 2021 - Mars 2022",
        },
        {
          lieu: "Armée de Terre",
          image: "/img/jobs/adt.svg",
          job: "Technicien de maintenance informatique",
          date: "2015 - 2021",
        },
      ],
    };
  },
  created() {
    window.addEventListener("resize", this.updateDenseTimeline);
    this.updateDenseTimeline();
  },
  methods: {
    updateDenseTimeline() {
      if (window.innerWidth < 445) {
        this.density = "compact";
      } else {
        this.density = "default";
      }
    },
  },
};
</script>
<style lang="scss">
/*.img {
  width: 10em;
  img {
    width: 100%;
  }
}*/
</style>
