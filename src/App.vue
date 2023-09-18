<template>
  <GameLifeGameBoard v-if="route !== 'gameLife'"/>
  <RouterView />
  
</template>

<script setup>
import GameLifeGameBoard from "./components/GameLifeGameBoard.vue";
import { RouterView } from "vue-router";
</script>
<script>
export default {
  data() {
    return {
      route: ''
    }
  },
  watch: {
    '$route': {
      handler(newValue){
        this.route = newValue.name
      },
      deep: true
    }
  },
}

</script>

<style scoped></style>
